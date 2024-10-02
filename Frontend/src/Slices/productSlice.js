import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const createProduct = createAsyncThunk('createProduct', async(productData, thunkAPI)=>{
    try{
        console.log("Inside createProduct createAsyncThunk")
        const response = await axios.post('/admin/products/add',{productData},{withCredentials:true})
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

const initialState = {
    products: [],
    loading: false,
    error: false
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        uploadImages: (state, action)=>{
            state.images = action.payload
            console.log("state.images from productSlice-->" + JSON.stringify(state.images))
        },
        deleteImage: (state, action)=>{
            state.images = state.images.filter(img=> img.url !== action.payload)
        },
        updateImage: (state, action)=>{
            state.editedImage = action.payload
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(createProduct.fulfilled, (state, action)=>{
            console.log("action.payload.product-->",action.payload.product)
            state.products = action.payload.product
            state.error = false
            state.loading = false
        })
        .addCase(createProduct.pending, (state,action)=>{
            state.loading = true
            state.error = false
        })
        .addCase(createProduct.rejected, (state,action)=>{
            state.loading = false
            state.error = true
        })
    }
})

export default productSlice.reducer
export const {uploadImages, deleteImage, updateImage} = productSlice.actions
