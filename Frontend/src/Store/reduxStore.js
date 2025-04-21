import {configureStore, combineReducers} from '@reduxjs/toolkit'
import {persistReducer,persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import sessionStorage from 'redux-persist/lib/storage/session' 
// import sessionStorage from './sesssionStorage' 
import { PAUSE,PERSIST,REGISTER,REHYDRATE,PURGE,FLUSH } from 'redux-persist'

import userReducer from '../Slices/userSlice'
import adminReducer from '../Slices/adminSlice'
import addressReducer from '../Slices/addressSlice'
import productReducer from '../Slices/productSlice'
import categoryReducer from '../Slices/categorySlice'
import wishlistReducer from '../Slices/wishlistSlice'
import couponReducer from '../Slices/couponSlice'
import offerReducer from '../Slices/offerSlice'
import cartReducer from '../Slices/cartSlice'
import orderReducer from '../Slices/orderSlice'
import walletReducer from '../Slices/walletSlice'


const walletPersistConfig = {
    key: 'wallet',
    storage: sessionStorage,
}

const rootReducer = combineReducers({
    user: userReducer,
    admin: adminReducer,
    address: addressReducer,
    productStore: productReducer,
    categoryStore: categoryReducer,
    wishlist: wishlistReducer,
    coupons: couponReducer,
    offers: offerReducer,
    cart: cartReducer,
    order: orderReducer,
    wallet: persistReducer(walletPersistConfig, walletReducer)
})

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['wallet']
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
