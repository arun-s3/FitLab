import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const createCatgeory = createAsyncThunk('createCatgeory', async({formData}, thunkAPI)=>{
    try{
        console.log("Inside createCatgeory createAsyncThunk")
        const response = await axios.post('/admin/products/category/add', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        console.log("returning success response from createCatgeory createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of createCatgeory from categorySlice")
        const errorMessage = error.response?.data?.message
        console.log("error object inside createAsyncThunk error.response-->"+JSON.stringify(error.response))
        console.log("error object inside createAsyncThunk error.response.data.message-->"+JSON.stringify(error.response.data.message))
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

const initialState = {
    category: [],
    loading: false,
    error: false,
    success:false,
    message: null,
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        resetStates: (state, action)=>{
            state.loading = false
            state.error = false
            state.success = false
            state.message = ''
            console.log(`Reseting states in categorySlice--> state.productCreated-${state.success}, state.productUpdated-${state.message}`)
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(createCatgeory.fulfilled, (state, action)=>{
            console.log("action.payload.product-->", JSON.stringify(action.payload.category))
            state.error = false
            state.loading = false
            state.success = true
            state.category.push(action.payload.category)
        })
        .addCase(createCatgeory.pending, (state,action)=>{
            state.loading = true
            state.error = false
            state.success = false
        })
        .addCase(createCatgeory.rejected, (state,action)=>{
            state.loading = false
            state.error = true
            state.success = true
        })
    }
})

export default categorySlice.reducer
export const {resetStates} = categorySlice.actions