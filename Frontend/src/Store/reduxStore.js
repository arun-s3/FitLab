import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistReducer,persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { PAUSE,PERSIST,REGISTER,REHYDRATE,PURGE,FLUSH } from 'redux-persist';

import userReducer from '../Slices/userSlice'
import adminReducer from '../Slices/adminSlice'
import addressReducer from '../Slices/addressSlice'
import productReducer from '../Slices/productSlice'
import categoryReducer from '../Slices/categorySlice'
import wishlistReducer from '../Slices/wishlistSlice'
import cartReducer from '../Slices/cartSlice'
import orderReducer from '../Slices/orderSlice'

const rootReducer = combineReducers({
    user: userReducer,
    admin: adminReducer,
    address: addressReducer,
    productStore: productReducer,
    categoryStore: categoryReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    order: orderReducer
})

const persistConfig = {
    key: 'root',
    storage,
    // blacklist: ["success", "error"]
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

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
