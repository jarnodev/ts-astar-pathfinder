import { AStar } from '../src/core/AStar';
import { Node } from '../src/core/Node';

const createGrid = (rows: number, cols: number): Node[][] =>
    Array.from({ length: rows }, (_, x) =>
        Array.from({ length: cols }, (_, y) => new Node(x, y))
    );

// Create a 5x5 grid
const grid = createGrid(5, 5);
const start: Node = grid[0][0];
const goal: Node = grid[4][4];

// Block some nodes
grid[1][1].walkable = false;
grid[2][2].walkable = false;

// Run A* algorithm
const aStar = new AStar(grid, start, goal);
const path = aStar.findPath();

// Visualize the grid and path
const output = grid.map(row =>
    row.map(node => {
        if (node === start) return 'S';
        if (node === goal) return 'G';
        if (!node.walkable) return 'X';
        if (path.includes(node)) return '*';
        return '.';
    }).join(' ')
).join('\n');

console.log(output);
