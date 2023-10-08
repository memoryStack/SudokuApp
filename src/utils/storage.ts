import AsyncStorage from '@react-native-async-storage/async-storage'

import _isNil from '@lodash/isNil'

import { consoleLog } from './util'

const getKey = async (KEY: string) => {
    if (!KEY) return null
    try {
        const value = await AsyncStorage.getItem(KEY)
        return value !== null ? JSON.parse(value) : null
    } catch (error: unknown) {
        if (error instanceof Error) consoleLog(error.message)
        return null
    }
}

const setKey = async (KEY: string, data: unknown) => {
    if (!KEY || _isNil(data)) return null
    try {
        // use JSON.stringify on all the data types because if type of data is string
        // and we don't do JSON.stringify then it will give error while doing JSON.parse on this value in "getKey" func
        await AsyncStorage.setItem(KEY, JSON.stringify(data))
    } catch (error) {
        return error
    }
    return null
}

export { getKey, setKey }
