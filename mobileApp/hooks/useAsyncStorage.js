import AsyncStorage from "@react-native-async-storage/async-storage";

function useAsyncStorage() {
 return {
    readFromStorage: async (key)=>{
        try {
            const value = await AsyncStorage.getItem(key);
            return value;
        } catch (error) {
            console.error("Error reading from AsyncStorage", error);
            return null;
        }
    },
    writeToStorage: async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error("Error writing to AsyncStorage", error);
        }
    },
    removeFromStorage: async (key) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error("Error removing from AsyncStorage", error);
        }
    }
 }   
}

export default useAsyncStorage;