import { AStar } from '../src/core/AStar';
import { Node } from '../src/core/Node';

const createGrid = (rows: number, cols: number): Node[][] =>
    Array.from({ length: rows }, (_, x) =>
        Array.from({ length: cols }, (_, y) => new Node(x, y))
    );

// 1. Create a grid (5x5 grid in this case)
const grid = createGrid(5, 5);

// 2. Set up start and goal nodes
const start: Node = grid[0][0];
const goal: Node = grid[4][4];

// 3. Mark some nodes as unwalkable
grid[1][1].walkable = false;
grid[1][2].walkable = false;

// 4. Create an AStar instance and find the path
const aStar = new AStar(grid, start, goal);
const path: Node[] = aStar.findPath();

// 5. Output the path
console.log('Path:', path.map(node => `(${node.x}, ${node.y})`));
