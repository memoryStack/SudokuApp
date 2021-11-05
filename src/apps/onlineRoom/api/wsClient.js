import { EventHandlers } from './responseHandlers'
const WebSocket = require('ws')

let conn = null

const initHostClient = () => {
    conn = new WebSocket("ws://localhost:3001/joinRoom")
    subscribeEvents(conn)
}

const initGuestClient = () => {
    // will handle this later
}

const subscribeEvents = conn => {
    // on connection is established
    conn.onopen = event => {
        console.log('@@@@@ connection is established:', event)
        // exampleSocket.send("Here's some text that the server is urgently awaiting!");
    }

    // on getting any error in connection
    conn.onerror = error => {
        console.log('@@@@@ error on socket connection:', error)
    }

    // on connection is closed
    conn.onclose = event => {
        console.log('@@@@@ websocket connection is closed:', event)
    }

    // on msg received
    conn.onmessage = event => {
        console.log('@@@@@@ received the data from server:', event.data)
        const resp = JSON.parse(event.data || {})
        const eventType = resp.type
        const handler = eventType ? EventHandlers[event] : null
        handler && handler()
    }

}   

const sendMessage = (msg) => {
    conn && conn.send(JSON.stringify(msg))
}

export { initHostClient, initGuestClient, sendMessage }


