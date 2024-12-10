import { Node } from './Node';
import { MinHeap } from './MinHeap';

export class AStar {
    private grid: Node[][];
    private openList: MinHeap<Node>;
    private _closedList: Set<Node>;
    private start: Node;
    private goal: Node;
    private heuristic: (node: Node, goal: Node) => number;

    constructor(grid: Node[][], start: Node, goal: Node, heuristic?: (node: Node, goal: Node) => number) {
        this.grid = grid;
        this.start = start;
        this.goal = goal;
        this.openList = new MinHeap((a, b) => a.f - b.f);
        this._closedList = new Set();

        this.heuristic = heuristic || this.defaultHeuristic;
    }

    get closedList(): Set<Node> {
        return this._closedList;
    }

    isValidPosition(x: number, y: number): boolean {
        return (
            x >= 0 &&
            x < this.grid.length &&
            y >= 0 &&
            y < this.grid[0].length &&
            this.grid[x][y].walkable
        );
    }

    findPath(): Node[] {
        this.grid.flat().forEach(node => node.reset());

        this.start.g = 0;
        this.start.h = this.heuristic(this.start, this.goal);
        this.start.f = this.start.g + this.start.h;
        this.openList.push(this.start);

        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0]
        ];

        while (!this.openList.isEmpty()) {
            const currentNode = this.openList.pop()!;
            this.closedList.add(currentNode);

            if (currentNode === this.goal) return this.reconstructPath(currentNode);

            for (const [dx, dy] of directions) {
                const nx = currentNode.x + dx;
                const ny = currentNode.y + dy;

                if (!this.isValidPosition(nx, ny)) continue;

                const neighbor = this.grid[nx][ny];
                if (this.closedList.has(neighbor)) continue;

                const tentativeG = currentNode.g + 1;
                if (tentativeG < neighbor.g) {
                    neighbor.g = tentativeG;
                    neighbor.h = this.heuristic(neighbor, this.goal);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = currentNode;

                    if (!this.openList.has(neighbor)) {
                        this.openList.push(neighbor);
                    }
                }
            }
        }

        return [];
    }

    defaultHeuristic(node: Node, goal: Node): number {
        return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
    }

    reconstructPath(node: Node): Node[] {
        const path: Node[] = [];
        let currentNode: Node | null = node;

        while (currentNode) {
            path.push(currentNode);
            currentNode = currentNode.parent;
        }

        return path.reverse();
    }
}
