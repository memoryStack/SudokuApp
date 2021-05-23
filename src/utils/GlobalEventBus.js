const listeners = {}

export function addListener(eventName, callback) {
    if (!eventName || !callback) return
    // if(eventName === INPUT_NUMBER_CLICKED)
    let callBacks = []
    if (listeners[eventName]) callBacks = listeners[eventName]
    callBacks.push(callback)
    listeners[eventName] = callBacks
}

export function setListener(eventName, callback) {
    if (!eventName || !callback) return
    listeners[eventName] = [callback]
}

export function emit(eventName, data) {
    if (!eventName) return
    const callBacks = listeners[eventName] || []
    console.log('@@@@@@@ callbacks for ', eventName, 'event are', callBacks.length)
    callBacks.forEach(callback => {
        callback(data)
    })
}

export function removeListener(eventName, callbackRef) {
    if (!eventName || !listeners[eventName]) return
    const i = listeners[eventName].indexOf(callbackRef)
    if (i !== -1) listeners[eventName].splice(i, 1)
    if (!listeners[eventName].length) removeAllListeners(eventName)
}

export function removeAllListeners(eventName) {
    delete listeners[eventName]
}
