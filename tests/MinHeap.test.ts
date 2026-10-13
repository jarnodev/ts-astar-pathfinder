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

    it('tracks its size', () => {
        const heap = new MinHeap<number>((a, b) => a - b);
        expect(heap.size).toBe(0);
        heap.push(2);
        heap.push(1);
        expect(heap.size).toBe(2);
        heap.pop();
        expect(heap.size).toBe(1);
    });

    it('pops many values in sorted order', () => {
        const heap = new MinHeap<number>((a, b) => a - b);
        const values = Array.from({ length: 1000 }, (_, i) => (i * 7919) % 1000);
        values.forEach((v) => heap.push(v));
        const popped: number[] = [];
        while (!heap.isEmpty()) popped.push(heap.pop()!);
        expect(popped).toEqual([...values].sort((a, b) => a - b));
    });

    it('stays ordered when pushes and pops are interleaved', () => {
        const heap = new MinHeap<number>((a, b) => a - b);
        const reference: number[] = [];
        for (let i = 0; i < 2000; i++) {
            if (i % 3 === 2) {
                reference.sort((a, b) => a - b);
                expect(heap.pop()).toBe(reference.shift());
            } else {
                const value = (i * 2654435761) % 997;
                heap.push(value);
                reference.push(value);
            }
        }
    });
});
