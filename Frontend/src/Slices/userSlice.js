import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const signup = createAsyncThunk('userSignup', async(formData, thunkAPI)=>{
    try{
        const response = await axios.post('/signup',formData)
        return response.data
    }
    catch(error){
        console.log("Error from signup asyncThunk--"+error.message)
        return thunkAPI.rejectWithValue(error.response.data.error)
    }
})

const initialState = {
    userToken: null,
    user: null,
    success:false,
    loading:false,
    error:null
}
const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        
    },
    extraReducers:(builder)=>{
        builder.addCase(signup.pending, (state,action)=>{
                state.success = false
            }
        )
        .addCase(signup.fulfilled, (state,action)=>{
                state.error = null
                state.success = true
        })
        .addCase(signup.rejected, (state,action)=>{
                state.error = action.payload
                state.success = false
        })
    }
})

export default userSlice.reducer
export const {} = userSlice.actions