export class MinHeap<T> {
    private heap: T[];
    private compare: (a: T, b: T) => number;

    /**
     * Constructs a MinHeap.
     * @param compare A comparison function that determines the heap order. 
     * Should return:
     * - A negative number if `a` has higher priority than `b`
     * - 0 if they are equal
     * - A positive number if `b` has higher priority than `a`
     */
    constructor(compare: (a: T, b: T) => number) {
        this.heap = [];
        this.compare = compare;
    }

    push(item: T): void {
        this.heap.push(item);
        this.bubbleUp(this.heap.length - 1);
    }

    pop(): T | undefined {
        if (this.heap.length === 0) return undefined;
        const root = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0 && last !== undefined) {
            this.heap[0] = last;
            this.bubbleDown(0);
        }
        return root;
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    has(item: T): boolean {
        return this.heap.includes(item);
    }

    private bubbleUp(index: number): void {
        const item = this.heap[index];
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.heap[parentIndex];
            if (this.compare(item, parent) >= 0) break;
            this.heap[index] = parent;
            index = parentIndex;
        }
        this.heap[index] = item;
    }

    private bubbleDown(index: number): void {
        const length = this.heap.length;
        const item = this.heap[index];
        while (true) {
            let leftIndex = 2 * index + 1;
            let rightIndex = 2 * index + 2;
            let smallest = index;

            if (leftIndex < length && this.compare(this.heap[leftIndex], this.heap[smallest]) < 0) {
                smallest = leftIndex;
            }

            if (rightIndex < length && this.compare(this.heap[rightIndex], this.heap[smallest]) < 0) {
                smallest = rightIndex;
            }

            if (smallest === index) break;
            this.heap[index] = this.heap[smallest];
            index = smallest;
        }
        this.heap[index] = item;
    }
}
