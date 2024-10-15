import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const createProduct = createAsyncThunk('createProduct', async({formData}, thunkAPI)=>{
    try{
        console.log("Inside createProduct createAsyncThunk")
        const response = await axios.post('/admin/products/add', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        console.log("returning success response from createProduct createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of createProduct from productSlice")
        const errorMessage = error.response?.data?.message
        console.log("error object inside createAsyncThunk error.response-->"+JSON.stringify(error.response))
        console.log("error object inside createAsyncThunk error.response.data.message-->"+JSON.stringify(error.response.data.message))
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const updateProduct = createAsyncThunk('updateProduct', async({formData, id}, thunkAPI)=>{
    try{
        console.log("Inside createProduct createAsyncThunk")
        console.log(`DATAS sending...formData--> ${JSON.stringify(formData)} and id--> ${id}`)
        const response = await axios.put(`/admin/products/edit/${id}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
        console.log("returning success response from createProduct createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of createProduct from productSlice")
        const errorMessage = error.response?.data?.message
        console.log("error object inside createAsyncThunk error.response-->"+JSON.stringify(error.response))
        console.log("error object inside createAsyncThunk error.response.data.message-->"+JSON.stringify(error.response.data.message))
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getAllProducts = createAsyncThunk('getAllProducts', async(queryOptions, thunkAPI)=>{
    try{
        console.log("Inside getAllProducts createAsyncThunk")
        const response = await axios.post('/products',{queryOptions},{withCredentials:true})
        console.log("returning success response from getAllProducts createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of getAllProducts from productSlice")
        const errorMessage = error.response?.data?.message
        console.log("error object inside createAsyncThunk error.response-->"+JSON.stringify(error.response))
        console.log("error object inside createAsyncThunk error.response.data.message-->"+JSON.stringify(error.response.data.message))
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

const initialState = {
    products: [],
    productCounts: null,
    loading: false,
    error: false,
    productCreated: false,
    productUpdated: false
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
            console.log(`Reseting states in ProductSlice--> state.productCreated-${state.productCreated}, state.productUpdated-${state.productUpdated}`)
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(createProduct.fulfilled, (state, action)=>{
            console.log("action.payload.product-->",action.payload.product)
            state.error = false
            state.loading = false
            state.productCreated = true
        })
        .addCase(createProduct.pending, (state,action)=>{
            state.loading = true
            state.error = false
            state.productCreated = false
        })
        .addCase(createProduct.rejected, (state,action)=>{
            state.loading = false
            state.error = true
            state.productCreated = false
        })
        .addCase(updateProduct.fulfilled, (state, action)=>{
            console.log("action.payload.product- after Updating->",action.payload.product)
            state.error = false
            state.loading = false
            state.productUpdated = true
        })
        .addCase(updateProduct.pending, (state,action)=>{
            state.loading = true
            state.error = false
            state.productUpdated = false
        })
        .addCase(updateProduct.rejected, (state,action)=>{
            state.loading = false
            state.error = true
            state.productUpdated = false
        })
        .addCase(getAllProducts.fulfilled, (state,action)=>{
            console.log("Inside getAllProducts.fulfilled")
            state.loading = false
            state.error = false
            // state.productSuccess = true
            state.products = action.payload.productBundle
            state.productCounts = action.payload.productCounts
        })
        .addCase(getAllProducts.pending, (state,action)=>{
            state.loading = true
            state.error = false
            // state.productSuccess = false
        })
        .addCase(getAllProducts.rejected, (state,action)=>{
            state.loading = false
            state.error = true
            // state.productSuccess = false
        })
    }
})

export default productSlice.reducer
export const {resetStates} = productSlice.actions
