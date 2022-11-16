import AsyncStorage from '@react-native-async-storage/async-storage'

const getKey = async KEY => {
    if (!KEY) return null
    try {
        const value = await AsyncStorage.getItem(KEY)
        return value !== null ? JSON.parse(value) : null
    } catch (error) {
        __DEV__ && console.log(error.message)
        return null
    }
}

const setKey = async (KEY, data) => {
    if (!KEY || data === undefined || data === null) return
    try {
        // use JSON.stringify on all the data types because if type of data is string
        // and we don't do JSON.stringify then it will give error while doing JSON.parse on this value in "getKey" func
        await AsyncStorage.setItem(KEY, JSON.stringify(data))
    } catch (error) {
        return error
    }
}

export { getKey, setKey }
