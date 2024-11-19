import { Node } from '../src/core/Node';
import { AStar } from '../src/core/AStar';

describe('AStar', () => {
    const createGrid = (rows: number, cols: number): Node[][] =>
        Array.from({ length: rows }, (_, x) =>
            Array.from({ length: cols }, (_, y) => new Node(x, y))
        );

    it('finds a path in an open grid', () => {
        const grid = createGrid(5, 5);
        const start = grid[0][0];
        const goal = grid[4][4];
        const aStar = new AStar(grid, start, goal);

        const path = aStar.findPath();
        expect(path.length).toBeGreaterThan(0);
        expect(path[0]).toBe(start);
        expect(path[path.length - 1]).toBe(goal);
    });

    it('returns an empty path if no path exists', () => {
        const grid = createGrid(5, 5);
        for (let i = 0; i < 5; i++) {
            grid[2][i].walkable = false; // Create a wall blocking the middle row
        }
        const start = grid[0][0];
        const goal = grid[4][4];
        const aStar = new AStar(grid, start, goal);

        const path = aStar.findPath();
        expect(path).toEqual([]);
    });

    it('handles grids with single cells', () => {
        const grid = [[new Node(0, 0)]];
        const start = grid[0][0];
        const goal = grid[0][0];
        const aStar = new AStar(grid, start, goal);

        const path = aStar.findPath();
        expect(path).toEqual([start]);
    });

    it('avoids obstacles', () => {
        const grid = createGrid(5, 5);
        grid[1][1].walkable = false;
        grid[1][2].walkable = false;
        grid[2][1].walkable = false;

        const start = grid[0][0];
        const goal = grid[4][4];
        const aStar = new AStar(grid, start, goal);

        const path = aStar.findPath();
        expect(path.every(node => node.walkable)).toBe(true);
        expect(path.length).toBeGreaterThan(0);
    });

    it('finds a path around a wall', () => {
        const grid = createGrid(5, 5);
        for (let i = 1; i < 4; i++) {
            grid[i][2].walkable = false; // Vertical wall
        }
        const start = grid[0][0];
        const goal = grid[4][4];
        const aStar = new AStar(grid, start, goal);

        const path = aStar.findPath();
        expect(path).toBeDefined();
        expect(path.length).toBeGreaterThan(0);
        expect(path[path.length - 1]).toBe(goal);
    });

    it('handles large grids efficiently', () => {
        const grid = createGrid(100, 100);
        const start = grid[0][0];
        const goal = grid[99][99];
        const aStar = new AStar(grid, start, goal);

        console.time('findPath');
        const path = aStar.findPath();
        console.timeEnd('findPath');

        expect(path.length).toBeGreaterThan(0);
        expect(path[0]).toBe(start);
        expect(path[path.length - 1]).toBe(goal);
    });

    it('avoids re-exploring nodes in the closed list', () => {
        const grid = createGrid(5, 5);
        grid[1][1].walkable = false;
        grid[1][2].walkable = false;

        const start = grid[0][0];
        const goal = grid[4][4];
        const aStar = new AStar(grid, start, goal);

        const path = aStar.findPath();

        expect(path.length).toBeGreaterThan(0);

        const closedList = Array.from(aStar.closedList); // Assuming closedList is accessible
        const uniqueNodes = new Set(closedList);

        // Assert that closedList contains no duplicates
        expect(closedList.length).toBe(uniqueNodes.size);
    });
});
