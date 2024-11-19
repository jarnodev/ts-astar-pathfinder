import { MinHeap } from '../src/core/MinHeap';

describe('MinHeap', () => {
    it('maintains min-heap property on insertions', () => {
        const heap = new MinHeap<number>((a, b) => a - b);
        heap.push(5);
        heap.push(3);
        heap.push(8);
        heap.push(1);
        heap.push(7);

        expect(heap.pop()).toBe(1);
        expect(heap.pop()).toBe(3);
        expect(heap.pop()).toBe(5);
        expect(heap.pop()).toBe(7);
        expect(heap.pop()).toBe(8);
    });

    it('returns undefined when popping an empty heap', () => {
        const heap = new MinHeap<number>((a, b) => a - b);
        expect(heap.pop()).toBeUndefined();
    });

    it('handles a single element correctly', () => {
        const heap = new MinHeap<number>((a, b) => a - b);
        heap.push(42);
        expect(heap.pop()).toBe(42);
        expect(heap.pop()).toBeUndefined();
    });

    it('supports custom comparison functions', () => {
        const heap = new MinHeap<string>((a, b) => a.length - b.length);
        heap.push('short');
        heap.push('tiny');
        heap.push('lengthier');
        heap.push('a');

        expect(heap.pop()).toBe('a');
        expect(heap.pop()).toBe('tiny');
        expect(heap.pop()).toBe('short');
        expect(heap.pop()).toBe('lengthier');
    });
});
