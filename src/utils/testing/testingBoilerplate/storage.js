export const getStoragePromise = value => new Promise(resolve => {
    process.nextTick(() => {
        resolve(value)
    })
})
