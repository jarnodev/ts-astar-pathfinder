import { AStar } from '../src/core/AStar';
import { Node } from '../src/core/Node';

const createGrid = (rows: number, cols: number): Node[][] =>
    Array.from({ length: rows }, (_, x) =>
        Array.from({ length: cols }, (_, y) => new Node(x, y))
    );
    
// Initialize a 10x10 grid
const grid = createGrid(10, 10);
const start: Node = grid[0][0];
const goal: Node = grid[9][9];

// Mark obstacles
grid[5][5].walkable = false;
grid[5][6].walkable = false;

// Initial pathfinding
const aStar = new AStar(grid, start, goal);
let path = aStar.findPath();
console.log('Initial Path:', path.map(node => `(${node.x}, ${node.y})`));

// Change grid dynamically
grid[5][5].walkable = true; // Remove obstacle
console.log('Updated grid!');

// Re-run pathfinding
path = aStar.findPath();
console.log('Updated Path:', path.map(node => `(${node.x}, ${node.y})`));
