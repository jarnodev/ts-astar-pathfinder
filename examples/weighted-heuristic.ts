import { AStar } from '../src/core/AStar';
import { Node } from '../src/core/Node';

const createGrid = (rows: number, cols: number): Node[][] =>
    Array.from({ length: rows }, (_, x) =>
        Array.from({ length: cols }, (_, y) => new Node(x, y))
    );

// Custom heuristic that weights Euclidean distance more heavily
const weightedEuclideanHeuristic = (node: Node, goal: Node): number => {
    const dx = Math.abs(node.x - goal.x);
    const dy = Math.abs(node.y - goal.y);
    return Math.sqrt(dx * dx + dy * dy);
}

// Create a grid
const grid = createGrid(7, 7);
const start: Node = grid[0][0];
const goal: Node = grid[6][6];

// Block some nodes
grid[2][2].walkable = false;
grid[2][3].walkable = false;

// Initialize AStar with the custom heuristic
const aStar = new AStar(grid, start, goal, weightedEuclideanHeuristic);
const path = aStar.findPath();

console.log('Weighted Heuristic Path:', path.map(node => `(${node.x}, ${node.y})`));
