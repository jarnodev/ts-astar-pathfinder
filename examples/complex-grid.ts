import { AStar } from '../src/core/AStar';
import { Node } from '../src/core/Node';

const createGrid = (rows: number, cols: number): Node[][] =>
    Array.from({ length: rows }, (_, x) =>
        Array.from({ length: cols }, (_, y) => new Node(x, y))
    );

// Create a 10x10 grid
const grid = createGrid(10, 10);
const start: Node = grid[0][0];
const goal: Node = grid[9][9];

// Block some complex paths
for (let i = 2; i < 8; i++) {
    grid[i][4].walkable = false; // Vertical wall
    grid[4][i].walkable = false; // Horizontal wall
}

// Find path through obstacles
const aStar = new AStar(grid, start, goal);
const path = aStar.findPath();

console.log('Complex Grid Path:', path.map(node => `(${node.x}, ${node.y})`));
