
export const getStoragePromise = (value) => {
    return new Promise((resolve) => {
        process.nextTick(() => {
            resolve(value)
        })
    })
}
