import { Node } from './Node';
import { MinHeap } from './MinHeap';

export type Heuristic = (node: Node, goal: Node) => number;

/**
 * Open-list entry. Priorities are copied rather than read from the node, because a node's
 * f/h change when a cheaper route is found and mutating keys in place would corrupt the heap.
 */
interface OpenEntry {
    node: Node;
    f: number;
    h: number;
}

// prettier-ignore
const DIRECTIONS = [
    [0, 1], [1, 0], [0, -1], [-1, 0], // Cardinal (Right, Down, Left, Up)
    [1, 1], [-1, -1], [1, -1], [-1, 1], // Diagonal (↘ ↖ ↙ ↗)
];

/**
 * Chebyshev distance: the exact cost on an open 8-directional grid where every
 * step (cardinal or diagonal) costs 1, so it never overestimates.
 */
export const chebyshevHeuristic: Heuristic = (node, goal) =>
    Math.max(Math.abs(node.x - goal.x), Math.abs(node.y - goal.y));

export class AStar {
    private grid: Node[][];
    private start: Node;
    private goal: Node;
    private heuristic: Heuristic;

    /**
     * @param grid Grid of nodes, indexed as `grid[x][y]`. Rows may differ in length.
     * @param start Start node; must be the node stored in `grid` at its coordinates.
     * @param goal Goal node; must be the node stored in `grid` at its coordinates.
     * @param heuristic Estimated cost from a node to the goal. Paths are only guaranteed
     * to be shortest if it never overestimates (each step costs 1, diagonals included).
     */
    constructor(grid: Node[][], start: Node, goal: Node, heuristic: Heuristic = chebyshevHeuristic) {
        if (grid.length === 0 || grid.every((row) => row.length === 0)) {
            throw new Error('Grid must contain at least one node');
        }
        this.grid = grid;
        this.start = this.assertInGrid(start, 'start');
        this.goal = this.assertInGrid(goal, 'goal');
        this.heuristic = heuristic;
    }

    isInBounds(x: number, y: number): boolean {
        return x >= 0 && x < this.grid.length && y >= 0 && y < this.grid[x].length;
    }

    isValidPosition(x: number, y: number): boolean {
        return this.isInBounds(x, y) && this.grid[x][y].walkable;
    }

    /**
     * Finds the shortest path from start to goal, moving in 8 directions.
     * Diagonal moves are not allowed to cut corners past unwalkable nodes.
     * Can be called repeatedly, e.g. after changing which nodes are walkable.
     * @returns The path including start and goal, or an empty array if none exists.
     */
    findPath(): Node[] {
        for (const row of this.grid) {
            for (const node of row) node.reset();
        }

        if (!this.start.walkable || !this.goal.walkable) return [];

        const openList = new MinHeap<OpenEntry>((a, b) => a.f - b.f || a.h - b.h);
        const closedList = this.grid.map((row) => new Array<boolean>(row.length).fill(false));

        this.start.g = 0;
        this.start.h = this.heuristic(this.start, this.goal);
        this.start.f = this.start.h;
        openList.push({ node: this.start, f: this.start.f, h: this.start.h });

        while (!openList.isEmpty()) {
            const currentNode = openList.pop()!.node;
            // A node is pushed again whenever a cheaper route to it is found; skip stale copies.
            if (closedList[currentNode.x][currentNode.y]) continue;
            closedList[currentNode.x][currentNode.y] = true;

            if (currentNode === this.goal) return this.reconstructPath(currentNode);

            for (const [dx, dy] of DIRECTIONS) {
                const nx = currentNode.x + dx;
                const ny = currentNode.y + dy;

                if (!this.isValidPosition(nx, ny) || closedList[nx][ny]) continue;
                if (dx !== 0 && dy !== 0 && !this.canMoveDiagonally(currentNode.x, currentNode.y, dx, dy)) {
                    continue;
                }

                const neighbor = this.grid[nx][ny];
                const tentativeG = currentNode.g + 1;

                if (tentativeG < neighbor.g) {
                    neighbor.g = tentativeG;
                    neighbor.h = this.heuristic(neighbor, this.goal);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = currentNode;
                    openList.push({ node: neighbor, f: neighbor.f, h: neighbor.h });
                }
            }
        }

        return [];
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

    /** A diagonal step is only allowed when both adjacent cardinal nodes are walkable. */
    private canMoveDiagonally(x: number, y: number, dx: number, dy: number): boolean {
        return this.isValidPosition(x + dx, y) && this.isValidPosition(x, y + dy);
    }

    private assertInGrid(node: Node, name: string): Node {
        if (!this.isInBounds(node.x, node.y) || this.grid[node.x][node.y] !== node) {
            throw new Error(`The ${name} node must be the node stored in the grid at (${node.x}, ${node.y})`);
        }
        return node;
    }
}
