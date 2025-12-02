import { http, HttpResponse } from 'msw'

export const handlers = [
    http.get('/appUpdate/:appVersion', () => {
        return HttpResponse.json({
            features: [], mandatory: false
        })
    }),
    http.get('/appUpdate/undefined', () => {
        console.log('@@@@@@@ app udpate')
        return HttpResponse.json({
            features: [], mandatory: false
        })
    }),
    http.get('/userFamiliarWithHints/:userId', () => {
        console.log('@@@@@@@ send event')
        return HttpResponse.json({
            isFamiliar: true
        })
    }),
    http.post('/api/sendEvent', () => {
        return HttpResponse.json({})
    }),
    http.post('http://52.66.253.10:3000/feedbacks', () => {
        return HttpResponse.json({ success: true })
    }),
    http.get('*', () => {
        return HttpResponse.json({})
    }),
]
