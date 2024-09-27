import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    images : [],
    editedImage: {}
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
    }
})

export default productSlice.reducer
export const {uploadImages, deleteImage, updateImage} = productSlice.actions
