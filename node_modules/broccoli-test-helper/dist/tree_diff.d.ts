import { Changes } from "./interfaces";
export default class TreeDiff {
    private path;
    changes: Changes;
    private previous;
    constructor(path: string);
    diff(): void;
}
