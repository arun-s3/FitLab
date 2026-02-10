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
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
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
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const toggleProductStatus = createAsyncThunk('toggleProductStatus', async(id, thunkAPI)=>{
    try{
        console.log("Inside toggleProductStatus createAsyncThunk")
        const response = await axios.get(`/admin/products/status/${id}`,{withCredentials:true})
        console.log("returning success response from toggleProductStatus createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of toggleProductStatus from productSlice")
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getAllProducts = createAsyncThunk('getAllProducts', async({queryOptions}, thunkAPI)=>{
    try{
        console.log("Inside getAllProducts createAsyncThunk")
        console.log("queryOptions from productSlice-getAllProducts--->", JSON.stringify(queryOptions))
        const response = await axios.post('/products',{queryOptions},{withCredentials:true})
        console.log("returning success response from getAllProducts createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of getAllProducts from productSlice")
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const searchProduct = createAsyncThunk('searchProduct', async({find}, thunkAPI)=>{
    try{
        console.log("Inside searchProduct createAsyncThunk")
        const response = await axios.get(`/products/search?find=${find}`, {withCredentials:true})
        console.log("returning success response from searchProduct createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of searchProduct from productSlice")
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
            console.log("action.payload.mainProduct-->",action.payload.mainProduct)
            console.log("action.payload.mainProduct-->",action.payload.variants)
            state.error = false
            state.loading = false
            state.productCreated = true
            // state.products.push(action.payload.mainProduct)
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
            const updatingProductIndex = state.products.findIndex(product=> product._id === action.payload.product._id)
            state.products[updatingProductIndex] = action.payload.product
            console.log("state.products[updatingProductIndex]-->", JSON.stringify(state.products[updatingProductIndex]))
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
            state.maxPriceAvailable = action.payload.maxPriceAvailable
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
        .addCase(searchProduct.fulfilled, (state,action)=>{
            console.log("Inside getAllProducts.fulfilled")
            state.loading = false
            state.error = false
            // state.productSuccess = true
            state.products = action.payload.products
            state.productCounts = action.payload.productCounts
            state.maxPriceAvailable = action.payload.maxPriceAvailable
        })
        .addCase(searchProduct.pending, (state,action)=>{
            state.loading = true
            state.error = false
            // state.productSuccess = false
        })
        .addCase(searchProduct.rejected, (state,action)=>{
            state.loading = false
            state.error = true
            // state.productSuccess = false
        })
        .addCase(toggleProductStatus.fulfilled, (state,action)=>{
            state.success = true
            state.message = action.payload.productBlocked
            state.loading = false
            state.error = false
            const updatingProductIndex = state.products.findIndex(product=> product._id === action.payload.productId)
            state.products[updatingProductIndex].isBlocked = state.message === 'Blocked'? true : false
            console.log("state.products[updatingProductIndex].isBlocked-->", state.products[updatingProductIndex].isBlocked)
        })
        .addCase(toggleProductStatus.pending, (state,action)=>{
            state.loading = true
            state.error = false
        })
        .addCase(toggleProductStatus.rejected, (state,action)=>{
            state.loading = false
            state.error = true
        })
    }
})

export default productSlice.reducer
export const {resetStates} = productSlice.actions
