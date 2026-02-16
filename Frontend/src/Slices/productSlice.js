import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import apiClient from '../Api/apiClient'


export const createProduct = createAsyncThunk('createProduct', async({formData}, thunkAPI)=>{
    try{
        const response = await apiClient.post('/admin/products/add', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const updateProduct = createAsyncThunk('updateProduct', async({formData, id}, thunkAPI)=>{
    try{
        const response = await apiClient.put(`/admin/products/edit/${id}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const toggleProductStatus = createAsyncThunk('toggleProductStatus', async(id, thunkAPI)=>{
    try{
        const response = await apiClient.get(`/admin/products/status/${id}`)
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getAllProducts = createAsyncThunk('getAllProducts', async({queryOptions}, thunkAPI)=>{
    try{
        const response = await apiClient.post('/products',{queryOptions})
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const restockProduct = createAsyncThunk('restockProduct', async({ productId, quantity }, thunkAPI)=>{
    try{
        const response = await apiClient.put("/admin/products/restock", { productId, quantity })
        return { productId, quantity }
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const searchProduct = createAsyncThunk('searchProduct', async({find}, thunkAPI)=>{
    try{
        const response = await apiClient.get(`/products/search?find=${find}`)
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})


const initialState = {
    products: [],
    productCounts: null,
    maxPriceAvailable: 100000,
    loading: false,
    error: false,
    success:false,
    message: null,
    productCreated: false,
    productUpdated: false ,
    productRestocked: false
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        resetStates: (state, action)=>{
            state.loading = false
            state.error = false
            state.productCreated = false
            state.productUpdated = false
            state.productRestocked = false
        }
    },
    extraReducers: (builder)=>{
        builder
            .addCase(createProduct.fulfilled, (state, action) => {
                state.error = false
                state.loading = false
                state.productCreated = true
                // state.products.push(action.payload.mainProduct)
            })
            .addCase(createProduct.pending, (state, action) => {
                state.loading = true
                state.error = false
                state.productCreated = false
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false
                state.error = true
                state.productCreated = false
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.error = false
                state.loading = false
                state.productUpdated = true
                const updatingProductIndex = state.products.findIndex(
                    (product) => product._id === action.payload.product._id,
                )
                state.products[updatingProductIndex] = action.payload.product
            })
            .addCase(updateProduct.pending, (state, action) => {
                state.loading = true
                state.error = false
                state.productUpdated = false
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false
                state.error = true
                state.productUpdated = false
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.loading = false
                state.error = false
                state.products = action.payload.productBundle
                state.productCounts = action.payload.productCounts
                state.maxPriceAvailable = action.payload.maxPriceAvailable
            })
            .addCase(getAllProducts.pending, (state, action) => {
                state.loading = true
                state.error = false
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.loading = false
                state.error = true
            })
            .addCase(restockProduct.pending, (state, action) => {
                state.loading = true
                state.error = false
                state.productRestocked = false
            })

            .addCase(restockProduct.fulfilled, (state, action) => {
                state.loading = false
                state.error = false
                state.productRestocked = true

                state.products = state.products.map((product) =>
                    product._id === action.payload.productId ? { ...product, stock: action.payload.quantity } : product,
                )
            })

            .addCase(restockProduct.rejected, (state, action) => {
                state.loading = false
                state.error = true
                state.productRestocked = false
            })

            .addCase(searchProduct.fulfilled, (state, action) => {
                state.loading = false
                state.error = false
                state.products = action.payload.products
                state.productCounts = action.payload.productCounts
                state.maxPriceAvailable = action.payload.maxPriceAvailable
            })
            .addCase(searchProduct.pending, (state, action) => {
                state.loading = true
                state.error = false
            })
            .addCase(searchProduct.rejected, (state, action) => {
                state.loading = false
                state.error = true
            })
            .addCase(toggleProductStatus.fulfilled, (state, action) => {
                state.success = true
                state.message = action.payload.productBlocked
                state.loading = false
                state.error = false
                const updatingProductIndex = state.products.findIndex(
                    (product) => product._id === action.payload.productId,
                )
                state.products[updatingProductIndex].isBlocked = state.message === "Blocked" ? true : false
            })
            .addCase(toggleProductStatus.pending, (state, action) => {
                state.loading = true
                state.error = false
            })
            .addCase(toggleProductStatus.rejected, (state, action) => {
                state.loading = false
                state.error = true
            })
    }
})

export default productSlice.reducer
export const {resetStates} = productSlice.actions
