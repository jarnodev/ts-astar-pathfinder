import { Node } from '../src/core/Node';
import { AStar } from '../src/core/AStar';

describe('AStar', () => {
    const createGrid = (rows: number, cols: number): Node[][] =>
        Array.from({ length: rows }, (_, x) => Array.from({ length: cols }, (_, y) => new Node(x, y)));

    /** Breadth-first search with the same movement rules as AStar, used as ground truth. */
    const shortestPathLength = (grid: Node[][], start: Node, goal: Node): number => {
        const walkable = (x: number, y: number) =>
            x >= 0 && x < grid.length && y >= 0 && y < grid[x].length && grid[x][y].walkable;
        const dist = new Map<Node, number>([[start, 0]]);
        const queue = [start];
        while (queue.length > 0) {
            const node = queue.shift()!;
            if (node === goal) return dist.get(node)!;
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const nx = node.x + dx;
                    const ny = node.y + dy;
                    if ((dx === 0 && dy === 0) || !walkable(nx, ny)) continue;
                    if (dx !== 0 && dy !== 0 && (!walkable(node.x + dx, node.y) || !walkable(node.x, node.y + dy))) {
                        continue;
                    }
                    const next = grid[nx][ny];
                    if (!dist.has(next)) {
                        dist.set(next, dist.get(node)! + 1);
                        queue.push(next);
                    }
                }
            }
        }
        return -1;
    };

    /** Asserts that consecutive nodes are adjacent, walkable, and never cut a corner. */
    const expectValidPath = (grid: Node[][], path: Node[]) => {
        for (let i = 1; i < path.length; i++) {
            const prev = path[i - 1];
            const node = path[i];
            const dx = node.x - prev.x;
            const dy = node.y - prev.y;
            expect(node.walkable).toBe(true);
            expect(Math.max(Math.abs(dx), Math.abs(dy))).toBe(1);
            if (dx !== 0 && dy !== 0) {
                expect(grid[prev.x + dx][prev.y].walkable).toBe(true);
                expect(grid[prev.x][prev.y + dy].walkable).toBe(true);
            }
        }
    };

    /** Small deterministic PRNG (mulberry32) so random grids are reproducible. */
    const seededRandom = (seed: number) => () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    it('finds the shortest path in an open grid', () => {
        const grid = createGrid(5, 5);
        const start = grid[0][0];
        const goal = grid[4][4];

        const path = new AStar(grid, start, goal).findPath();
        expect(path[0]).toBe(start);
        expect(path[path.length - 1]).toBe(goal);
        expect(path).toHaveLength(5); // Straight diagonal
        expectValidPath(grid, path);
    });

    it('returns an empty path if no path exists', () => {
        const grid = createGrid(5, 5);
        for (let i = 0; i < 5; i++) {
            grid[2][i].walkable = false; // Wall blocking the middle row
        }
        expect(new AStar(grid, grid[0][0], grid[4][4]).findPath()).toEqual([]);
    });

    it('handles grids with single cells', () => {
        const grid = [[new Node(0, 0)]];
        const node = grid[0][0];
        expect(new AStar(grid, node, node).findPath()).toEqual([node]);
    });

    it('finds the shortest path around a wall', () => {
        const grid = createGrid(5, 5);
        for (let i = 1; i < 5; i++) {
            grid[i][2].walkable = false; // Vertical wall, open only at the top
        }
        const start = grid[4][0];
        const goal = grid[4][4];

        const path = new AStar(grid, start, goal).findPath();
        expect(path[path.length - 1]).toBe(goal);
        expect(path.length - 1).toBe(shortestPathLength(grid, start, goal));
        expectValidPath(grid, path);
    });

    it('does not cut corners between diagonal obstacles', () => {
        const grid = createGrid(2, 2);
        grid[0][1].walkable = false;
        grid[1][0].walkable = false;
        expect(new AStar(grid, grid[0][0], grid[1][1]).findPath()).toEqual([]);
    });

    it('does not cut a corner past a single obstacle', () => {
        const grid = createGrid(2, 2);
        grid[0][1].walkable = false;
        const path = new AStar(grid, grid[0][0], grid[1][1]).findPath();
        expect(path.map((n) => [n.x, n.y])).toEqual([
            [0, 0],
            [1, 0],
            [1, 1],
        ]);
    });

    it('matches brute-force shortest path lengths on random grids', () => {
        const random = seededRandom(42);
        let solvable = 0;
        for (let trial = 0; trial < 500; trial++) {
            const grid = createGrid(10, 10);
            for (const row of grid) {
                for (const node of row) node.walkable = random() >= 0.3;
            }
            const start = grid[0][0];
            const goal = grid[9][9];
            start.walkable = goal.walkable = true;

            const path = new AStar(grid, start, goal).findPath();
            const expected = shortestPathLength(grid, start, goal);
            expect(path.length - 1).toBe(expected);
            if (expected > 0) {
                solvable++;
                expectValidPath(grid, path);
            }
        }
        expect(solvable).toBeGreaterThan(100); // Make sure the test is meaningful
    });

    it('returns the same result when findPath is called repeatedly', () => {
        const grid = createGrid(5, 5);
        const aStar = new AStar(grid, grid[0][0], grid[4][4]);
        const first = aStar.findPath();
        expect(first.length).toBeGreaterThan(0);
        expect(aStar.findPath()).toEqual(first);
    });

    it('reflects grid changes between findPath calls', () => {
        const grid = createGrid(3, 3);
        for (let i = 0; i < 3; i++) grid[1][i].walkable = false;
        const aStar = new AStar(grid, grid[0][0], grid[2][2]);
        expect(aStar.findPath()).toEqual([]);

        // Opening the middle node allows a path, but diagonals through it would cut corners
        grid[1][1].walkable = true;
        expect(aStar.findPath().map((n) => [n.x, n.y])).toEqual([
            [0, 0],
            [0, 1],
            [1, 1],
            [2, 1],
            [2, 2],
        ]);
    });

    it('returns an empty path when the start or goal is unwalkable', () => {
        const grid = createGrid(3, 3);
        grid[2][2].walkable = false;
        expect(new AStar(grid, grid[0][0], grid[2][2]).findPath()).toEqual([]);
        expect(new AStar(grid, grid[2][2], grid[0][0]).findPath()).toEqual([]);
    });

    it('rejects start or goal nodes that are not part of the grid', () => {
        const grid = createGrid(3, 3);
        expect(() => new AStar(grid, grid[0][0], new Node(2, 2))).toThrow(/goal/);
        expect(() => new AStar(grid, new Node(0, 0), grid[2][2])).toThrow(/start/);
        expect(() => new AStar(grid, grid[0][0], new Node(5, 5))).toThrow(/goal/);
    });

    it('rejects empty grids', () => {
        expect(() => new AStar([], new Node(0, 0), new Node(0, 0))).toThrow(/at least one node/);
    });

    it('supports grids with rows of different lengths', () => {
        const grid = [[new Node(0, 0)], [new Node(1, 0), new Node(1, 1)]];
        const path = new AStar(grid, grid[0][0], grid[1][1]).findPath();
        expect(path.map((n) => [n.x, n.y])).toEqual([
            [0, 0],
            [1, 0],
            [1, 1],
        ]);
    });

    it('uses a custom heuristic when provided', () => {
        const grid = createGrid(5, 5);
        const heuristic = jest.fn(() => 0);
        const path = new AStar(grid, grid[0][0], grid[4][4], heuristic).findPath();
        expect(heuristic).toHaveBeenCalled();
        expect(path).toHaveLength(5);
    });

    it('handles large grids', () => {
        const grid = createGrid(200, 200);
        for (let i = 0; i < 190; i++) grid[100][i].walkable = false;
        const start = grid[0][0];
        const goal = grid[199][199];

        const path = new AStar(grid, start, goal).findPath();
        expect(path[0]).toBe(start);
        expect(path[path.length - 1]).toBe(goal);
        expect(path.length - 1).toBe(shortestPathLength(grid, start, goal));
    });
});
