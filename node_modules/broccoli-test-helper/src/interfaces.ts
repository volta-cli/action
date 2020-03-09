/**
 * Test helper for building output and making assertions.
 * @public
 */
export interface Output extends ReadableDir, Disposable {
  /**
   * The builder associated with this output test helper.
   * @public
   */
  builder: Builder;

  /**
   * Get changes from last build.
   *
   * Use to assert deep equal against expected changes.
   *
   * @returns map of paths to type of change.
   * @public
   */
  changes(): Changes;

  /**
   * Build output.
   * @returns promise of build completion.
   * @public
   */
  build(): Promise<void>;

  /**
   * Build output.
   * @deprecated
   * @private
   */
  rebuild(): Promise<Output>;
}

/**
 * A disposable temporary directory for writing mutable fixture data to.
 * @public
 */
export interface TempDir extends ReadableDir, Disposable {
  /**
   * Gets the changes since the last time changes() was called or
   * since the temporary directory was created.
   * @public
   */
  changes(): Changes;

  /**
   * Write to the temporary directory.
   *
   * @param content the content to write to the temporary directory.
   * @param subpath a subpath to write to within the temporary directory.
   * @public
   */
  write(content: Tree, subpath?: string): void;

  /**
   * Copy contents of a directory to the temporary directory.
   *
   * @param from a directory to copy from.
   * @param to a optional subpath within the temporary directory to write to. By default it writes to the root of the tmp dir.
   * @public
   */
  copy(from: string, to?: string): void;

  /**
   * Write a binary file to the temporary directory.
   *
   * The `write` and `copy` only support text files.
   *
   * Use this method to write a binary file to the temp dir.
   *
   * @param subpath the subpath of the file.
   * @param data the binary data.
   * @public
   */
  writeBinary(subpath: string, data: Buffer): void;

  /**
   * Write a text file at the specified subpath with the specified encoding or `'utf8'`.
   * @param subpath the subpath within the directory of the file.
   * @param text the text to write.
   * @param encoding an optional encoding (default `'utf8'`)
   */
  writeText(subpath: string, text: string, encoding?: string): void;

  /**
   * Make a directory at the specified subpath
   * @param subpath the subpath to create the directory within this directory.
   */
  makeDir(subpath: string): void;
}

/**
 * Interface expected by the output test helper for a builder.
 * @public
 */
export interface BuilderConstructor {
  new(node: Tree): Builder;
}
export interface Builder {
  /**
   * Path to output of the builder.
   * @public
   */
  outputPath: string;

  /**
   * Builds output.
   * @public
   */
  build(): Promise<void>;

  /**
   * Cleanup temporary build artifacts.
   *
   * Current version is void return but reserves the possibility of
   * returning a promise in the future so the test helper just always
   * returns a promise for dispose.
   * @public
   */
  cleanup(): Promise<void> | void;
}

/**
 * Common methods for directory test helpers.
 * @public
 */
export interface ReadableDir {
  /**
   * Read the content of the directory.
   * @param options
   * @public
   */
  read(options?: ReadOptions): Tree;

  /**
   * Read the content of the directory.
   * @param from  a relative path to read from within the directory.
   * @param options
   * @public
   */
  read(
    from?: string,
    options?: {
      include?: string[];
      exclude?: string[];
    }
  ): Tree;

  /**
   * Resolves and normalizes the path to the directory or the subpath if specified.
   *
   * @param subpath subpath within the directory.
   * @public
   */
  path(subpath?: string): string;

  /**
   * Reads the binary file at the specified subpath.
   *
   * @returns the `Buffer` of the file or `undefined` if error is EISDIR or ENOENT
   * @public
   */
  readBinary(subpath: string): Buffer | undefined;

  /**
   * Reads the text file at the specified subpath.
   * @param subpath the subpath within the directory of the file.
   * @param encoding an optional encoding (default utf8)
   * @returns the text of the file or `undefined` if error is EISDIR or ENOENT
   * @public
   */
  readText(subpath: string, encoding?: string): string | undefined;

  /**
   * Reads the directory entries recursively using the specified options.
   * @returns an array containing all recursive files and directories
   * @param options the options for reading the directory.
   */
  readDir(options?: ReadDirOptions): string[];

  /**
   * Reads the directory entries recursively at the specified subpath using the specified options.
   * @returns an array containing all recursive files and directories or `undefined` if error is ENOTDIR or ENOENT
   * @public
   */
  readDir(subpath?: string, options?: ReadDirOptions): string[] | undefined;

  /**
   * Gets the changes since the last time changes() or starts tracking and
   * returns empty.
   * @return the changes since the last time changes() was called or an empty array.
   * @public
   */
  changes(): Changes;
}

/**
 * Map of path to change type
 * @public
 */
export interface Changes {
  [path: string]: ChangeOp;
}

/**
 * Change operation.
 * @public
 */
export type ChangeOp = "unlink" | "create" | "mkdir" | "rmdir" | "change";

/**
 * Represents a directory's contents.
 *
 * @public
 */
export interface Tree {
  /**
   * Map directory entry to a Directory or file contents or null (delete when writing directory).
   *
   * @public
   */
  [name: string]: TreeEntry | undefined;
}

/**
 * Tree entry value type.
 *
 * `string` if entry is a file.
 * `Tree` if entry is a directory.
 * `null` if entry represents deletion `write(tree)`
 *
 * @public
 */
export type TreeEntry = Tree | string | null;

/**
 * A disposable
 */
export interface Disposable {
  /**
   * Cleanup disposable
   * @public
   */
  dispose(): Promise<void>;
}

/**
 * Options for `ReadableDir.read`
 */
export interface ReadOptions {
  /**
   * Array of globs to include
   */
  include?: string[];
  /**
   * Array of globs to exclude
   */
  exclude?: string[];
}

/**
 * Options for `Tree.readDir`
 */
export interface ReadDirOptions {
  /**
   * Array of globs to include
   */
  include?: string[];
  /**
   * Array of globs to exclude
   */
  exclude?: string[];
  /**
   * Whether directories should be included in readDir result.
   */
  directories?: boolean;
}
