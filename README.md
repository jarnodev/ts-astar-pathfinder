# A\* Pathfinding Algorithm (TypeScript/JavaScript)

## Overview

This package provides an efficient A\* (A-Star) pathfinding implementation in TypeScript/JavaScript. The A\* algorithm is commonly used in AI pathfinding and game development to find the shortest path between two points in a grid-based environment.

## Features

- **Shortest paths** on 8-directional grids (cardinal and diagonal moves, each costing 1)
- **No corner cutting**: diagonal moves never squeeze past obstacles
- **Custom heuristics**, including weighted A\* for faster, near-optimal searches
- **Reusable**: call `findPath()` again after changing the grid
- **Zero runtime dependencies**, binary-heap open list
- **Tested** with Jest, including comparison against brute-force shortest paths

## Installation

Install the package via npm:

```bash
npm install ts-astar-pathfinder
```

or via yarn:

```bash
yarn add ts-astar-pathfinder
```

## Usage

### Basic Example

```typescript
import { Node, AStar } from 'ts-astar-pathfinder';

// Create a 5x5 grid, indexed as grid[x][y]
const grid: Node[][] = [];
for (let x = 0; x < 5; x++) {
  grid[x] = [];
  for (let y = 0; y < 5; y++) {
    grid[x][y] = new Node(x, y);
  }
}

// Add obstacles
grid[1][1].walkable = false;
grid[2][2].walkable = false;

// Set start and goal nodes (must be nodes from the grid)
const start = grid[0][0];
const goal = grid[4][4];

// Create A* instance
const aStar = new AStar(grid, start, goal);

// Find the shortest path
const path = aStar.findPath();

// Output result
if (path.length > 0) {
  console.log('Path found:');
  path.forEach((node) => console.log(`(${node.x}, ${node.y})`));
} else {
  console.log('No path found');
}
```

### Grid Representation

The path found by the example above (each row is one `x`, each column one `y`):

```
S * * . .
. X . * .
. . X * .
. . . * .
. . . . G
```

Where:

- `S` = Start position
- `G` = Goal position
- `X` = Obstacles
- `*` = Path found by A\*
- `.` = Walkable space

### Custom and Weighted Heuristics

The default heuristic is Chebyshev distance, which is exact on an open grid where diagonal moves cost 1. You can pass your own as the fourth constructor argument. Paths are only guaranteed to be shortest if the heuristic never overestimates the remaining number of steps.

Multiplying the heuristic by a weight greater than 1 (weighted A\*) usually explores fewer nodes, in exchange for paths that may be up to `weight` times longer:

```typescript
import { AStar, chebyshevHeuristic } from 'ts-astar-pathfinder';

const aStar = new AStar(grid, start, goal, (node, goal) => 1.5 * chebyshevHeuristic(node, goal));
```

See [`examples/`](examples) for more, and run one with `npm run example examples/weighted-heuristic.ts`.

## API

### `Node` Class

Represents a node (cell) in the grid.

```typescript
class Node {
  constructor(x: number, y: number, walkable?: boolean); // walkable defaults to true
  x: number; // X coordinate (first grid index)
  y: number; // Y coordinate (second grid index)
  walkable: boolean; // Can the node be walked on?
  g: number; // Movement cost from start node
  h: number; // Heuristic estimated cost to goal
  f: number; // Total cost (g + h)
  parent: Node | null; // Parent node for path reconstruction
}
```

### `AStar` Class

Implements the A\* pathfinding algorithm.

```typescript
type Heuristic = (node: Node, goal: Node) => number;

class AStar {
  // Throws if the grid is empty, or if start/goal are not the grid's nodes at their coordinates.
  // Rows may have different lengths.
  constructor(grid: Node[][], start: Node, goal: Node, heuristic?: Heuristic);
  // Returns the path from start to goal (inclusive), or [] if there is none.
  // Can be called repeatedly; changes to `walkable` are picked up on each call.
  findPath(): Node[];
}

const chebyshevHeuristic: Heuristic; // The default heuristic
```

`MinHeap<T>` is also exported, a generic binary heap with `push`, `pop`, `isEmpty` and `size`.

## Development

```bash
npm test            # Run the Jest test suite
npm run lint        # ESLint + Prettier
npm run typecheck   # Type-check sources, tests and examples
npm run build       # Compile to dist/
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.

## Contributions

Contributions are welcome! Feel free to submit issues and pull requests.

## Author

**Jarno Mensink** – [GitHub](https://github.com/jarnodev) | [Website](https://jarnodev.com)
