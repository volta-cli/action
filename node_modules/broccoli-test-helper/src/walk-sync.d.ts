declare function walkSync(
  path: string,
  options?: {
    globs?: string[];
    ignore?: string[];
    directories?: boolean;
  }
): string[];
declare namespace walkSync {
  export function entries(path: string): import("./util").Entry[];
}
export = walkSync;
