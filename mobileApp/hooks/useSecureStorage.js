import * as SecureStore from "expo-secure-store";

const useSecureStorage = () => {
    return {
     async saveItem(key,value){
        await SecureStore.setItemAsync(key,value)
     },
     async getItem(key){
        return await SecureStore.getItemAsync(key)
     },
     async deleteItem(key){
        await SecureStore.deleteItemAsync(key)
     }   
    }
}

export default useSecureStorage
