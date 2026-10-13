import { AStar, chebyshevHeuristic, Heuristic, Node } from '../src';

const createGrid = (rows: number, cols: number): Node[][] =>
    Array.from({ length: rows }, (_, x) => Array.from({ length: cols }, (_, y) => new Node(x, y)));

// Weighted A*: multiplying the heuristic by a weight > 1 makes the search greedier.
// It usually explores fewer nodes, but the path is only guaranteed to be at most
// `weight` times longer than the shortest one.
const weighted =
    (heuristic: Heuristic, weight: number): Heuristic =>
    (node, goal) =>
        weight * heuristic(node, goal);

// Wraps a heuristic to count how often it is evaluated (a rough measure of search effort)
const counted = (heuristic: Heuristic) => {
    const wrapped = (node: Node, goal: Node) => {
        wrapped.calls++;
        return heuristic(node, goal);
    };
    wrapped.calls = 0;
    return wrapped;
};

// A grid with an L-shaped wall between start and goal
const createWalledGrid = () => {
    const grid = createGrid(50, 50);
    for (let x = 10; x < 40; x++) grid[x][30].walkable = false;
    for (let y = 10; y <= 30; y++) grid[10][y].walkable = false;
    return grid;
};

for (const weight of [1, 1.5, 3]) {
    const grid = createWalledGrid();
    const heuristic = counted(weighted(chebyshevHeuristic, weight));
    const path = new AStar(grid, grid[25][0], grid[25][49], heuristic).findPath();
    console.log(`weight ${weight}: path length ${path.length - 1}, heuristic evaluations ${heuristic.calls}`);
}
