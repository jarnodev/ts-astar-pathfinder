# A\* Pathfinding Algorithm (TypeScript/JavaScript)

&#x20;&#x20;

## Overview

This package provides an efficient A\* (A-Star) pathfinding implementation in TypeScript/JavaScript. The A\* algorithm is commonly used in AI pathfinding and game development to find the shortest path between two points in a grid-based environment.

## Features

- *Efficient A** pathfinding*\* algorithm implementation
- **Supports weighted heuristics** for custom pathfinding behavior
- **Configurable grid-based system** with obstacles
- **Lightweight and fast**
- **Fully tested** with Jest

## Installation

Install the package via npm:

```bash
npm install astar-pathfinder
```

or via yarn:

```bash
yarn add astar-pathfinder
```

## Usage

### Basic Example

```typescript
import { Node, AStar } from 'astar-pathfinder';

// Create a 5x5 grid
const grid: Node[][] = [];
for (let x = 0; x < 5; x++) {
    grid[x] = [];
    for (let y = 0; y < 5; y++) {
        grid[x][y] = new Node(x, y);
    }
}

// Add obstacles
grid[2][2].walkable = false;
grid[3][1].walkable = false;

// Set start and goal nodes
const start = grid[0][0];
const goal = grid[4][4];

// Create A* instance
const aStar = new AStar(grid, start, goal);

// Find the shortest path
const path = aStar.findPath();

// Output result
if (path.length > 0) {
    console.log('Path found:');
    path.forEach(node => console.log(`(${node.x}, ${node.y})`));
} else {
    console.log('No path found');
}
```

### Grid Representation

```
S * * . .
. X * * .
. . X * .
. . . * .
. . . * G
```

Where:

- `S` = Start position
- `G` = Goal position
- `X` = Obstacles
- `*` = Path found by A\*
- `.` = Walkable space

## API

### `Node` Class

Represents a node (cell) in the grid.

```typescript
class Node {
  x: number; // X coordinate
  y: number; // Y coordinate
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
class AStar {
  constructor(grid: Node[][], start: Node, goal: Node);
  findPath(): Node[]; // Returns the shortest path as an array of Nodes
}
```

## Testing

Run tests using Jest:

```bash
npm test
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.

## Contributions

Contributions are welcome! Feel free to submit issues and pull requests.

## Author

**Jarno Mensink** – [GitHub](https://github.com/jarnodev) | [Website](https://jarnodev.com)

