import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const signup = createAsyncThunk('userSignup', async(formData, thunkAPI)=>{
    try{
        const response = await axios.post('/signup',formData)
        console.log("returning success response from signup createAsyncThunk..."+JSON.stringify(response))
        return response.data
    }
    catch(error){
        console.log("inside catch of signup")
        console.log("Error from signup asyncThunk--error message"+error.message)
        console.log("Error from signup asyncThunk--error obj"+JSON.stringify(error))
        console.log("hello")
        // return error.message
        return thunkAPI.rejectWithValue(error.message)
    }
})

export const signin = createAsyncThunk('signin', async(formData, thunkAPI)=>{
    try{
        const response = await axios.post('/signin',formData)
        console.log("returning success response from sigin createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of signin")
        console.log("Error from signup asyncThunk--error message"+error.message)
        console.log("Error from signup asyncThunk--error obj"+JSON.stringify(error))
        return thunkAPI.rejectWithValue(error.message)
    }
})

export const signout = createAsyncThunk('signout',async(thunkAPI)=>{
    try{
        const response = axios.get('/signout')
        console.log("response from signout createAsyncThunk-->"+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("error in signout createAsyncThunk-->"+error.message)
        return thunkAPI.rejectWithValue(error.message)
    }
})

const initialState = {
    userToken: null,
    user: null,
    error:null,
    loading:false,
    success:false,
}
const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        resetStates: (state,action)=>{
            state.error = null
            state.loading = false
            state.success = false
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(signup.pending, (state,action)=>{
                state.loading = true
                state.success = false
                console.log("loading from userSlice signup.pending--"+state.loading)
            }
        )
        .addCase(signup.fulfilled, (state,action)=>{
                state.error = null
                state.loading = false
                state.success = true
                console.log("userData from userSlice--user-->"+JSON.stringify(action.payload.user))
                console.log("message from userSlice-->"+JSON.stringify(action.payload.message))
        })
        .addCase(signup.rejected, (state,action)=>{
                console.log("error from userSlice- signup.rejected-->"+ state.error)
                console.log("error payload from userSlice- signup.rejected-->"+JSON.stringify(action.payload))
                state.error = action.payload
                state.loading = false
                state.success = false
        })
        .addCase(signin.pending, (state,action)=>{
                state.loading = true
                state.success = false
                console.log("loading from userSlice signin.pending--"+state.loading)
        })
        .addCase(signin.fulfilled, (state,action)=>{
                state.loading = false
                state.error = null
                state.success = true
                state.userToken = action.payload.token
                state.user = action.payload.user
                console.log("userData from userSlice--user-->"+JSON.stringify(state.user))
                console.log("token from userSlice--token-->"+JSON.stringify(state.userToken))
                console.log("message from userSlice-->"+JSON.stringify(action.payload.message))
        })
        .addCase(signin.rejected, (state,action)=>{
                console.log("error from userSlice- signin.rejected before assignment-->"+ state.error)
                console.log("error payload from userSlice- signin.rejected-->"+JSON.stringify(action.payload))
                state.error = action.payload
                state.loading = false
                state.success = false
                console.log("error from userSlice- signin.rejected after assignment-->"+ state.error)
         })
        .addCase(signout.fulfilled, (state,action)=>{
                console.log("inside signout.fulfilled, action.payload"+JSON.stringify(action.payload))
                state.userToken = null
                console.log("state.userToken now-->"+state.userToken )
        })
    }
})

export default userSlice.reducer
export const {resetStates} = userSlice.actions