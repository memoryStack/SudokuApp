import { Stack } from '../stack'

describe('Stack', () => {
    let stack
    beforeEach(() => {
        stack = new Stack()
    })

    test('should push elements onto the stack', () => {
        stack.push(1)
        stack.push(2)
        expect(stack.peek()).toBe(2)
    })

    test('should return the number of items in stack', () => {
        stack.push(10)
        stack.push(22)
        expect(stack.length()).toBe(2)
    })

    test('should pop elements from the stack in Last In First Out, pop will return the deleted item as well', () => {
        stack.push(1)
        stack.push(2)
        expect(stack.pop()).toBe(2)
        expect(stack.pop()).toBe(1)
        expect(stack.pop()).toBeUndefined()
    })

    test('should peek the top element of the stack without removing it', () => {
        stack.push(1)
        stack.push(2)
        expect(stack.peek()).toBe(2)
        expect(stack.pop()).toBe(2)
        expect(stack.peek()).toBe(1)
        stack.pop()
        expect(stack.peek()).toBeUndefined()
    })

    test('should check if the stack is empty', () => {
        expect(stack.isEmpty()).toBe(true)
        stack.push(1)
        expect(stack.isEmpty()).toBe(false)
        stack.pop()
        expect(stack.isEmpty()).toBe(true)
    })
})
