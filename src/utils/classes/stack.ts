import _last from '@lodash/last'

export class Stack<T> {
    private items: T[]

    constructor() {
        this.items = []
    }

    push(element: T): void {
        this.items.push(element)
    }

    pop(): T | undefined {
        if (this.isEmpty()) {
            return undefined
        }
        return this.items.pop()
    }

    peek(): T | undefined {
        return _last(this.items)
    }

    isEmpty(): boolean {
        return this.length() === 0
    }

    length(): number {
        return this.items.length
    }
}
