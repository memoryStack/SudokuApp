export const fetchStepCount = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(3)
        }, 3000)
    })
}