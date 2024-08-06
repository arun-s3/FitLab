import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistReducer,persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { PAUSE,PERSIST,REGISTER,REHYDRATE,PURGE,FLUSH } from 'redux-persist';

import userReducer from '../Slices/userSlice'

const rootReducer = combineReducers({
    user: userReducer
})

const persistConfig = {
    key: 'root',
    storage
}

const persistedReducer = persistReducer(persistConfig,rootReducer);

const store = configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:{
                ignoreActions:[PAUSE,PERSIST,REGISTER,REHYDRATE,PURGE,FLUSH]
            }
        })
})
export const persistor = persistStore(store)
export default store
