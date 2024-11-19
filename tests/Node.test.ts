import { Node } from '../src/core/Node';

describe('Node', () => {
    it('initializes with correct properties', () => {
        const node = new Node(1, 2, true);
        expect(node.x).toBe(1);
        expect(node.y).toBe(2);
        expect(node.walkable).toBe(true);
        expect(node.g).toBe(Infinity);
        expect(node.h).toBe(0);
        expect(node.f).toBe(Infinity);
        expect(node.parent).toBeNull();
    });

    it('resets properties correctly', () => {
        const node = new Node(0, 0, false);
        node.g = 10;
        node.h = 20;
        node.f = 30;
        node.parent = new Node(1, 1);

        node.reset();

        expect(node.g).toBe(Infinity);
        expect(node.h).toBe(0);
        expect(node.f).toBe(Infinity);
        expect(node.parent).toBeNull();
    });
});
