export class Node {
    x: number;
    y: number;
    g: number;
    h: number;
    f: number;
    parent: Node | null;
    walkable: boolean;

    constructor(x: number, y: number, walkable: boolean = true) {
        this.x = x;
        this.y = y;
        this.g = Infinity;
        this.h = 0;
        this.f = Infinity;
        this.parent = null;
        this.walkable = walkable;
    }

    reset(): void {
        this.g = Infinity;
        this.h = 0;
        this.f = Infinity;
        this.parent = null;
    }
}
