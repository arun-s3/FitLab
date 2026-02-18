import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import apiClient from '../Api/apiClient'


export const createCategory = createAsyncThunk('createCategory', async({formData}, thunkAPI)=>{
    try{
        const response = await apiClient.post('/admin/products/category/add', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getAllCategories = createAsyncThunk('getAllCategories', async(_, thunkAPI)=>{
    try{
        const response = await apiClient.get('/admin/products/category')
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getCategoriesOfType = createAsyncThunk('getCategoriesOfType', async({status, isActive}, thunkAPI)=>{
    try{
        const response = await apiClient.get(`/admin/products/category/?status=${status}&isActive=${isActive}`)
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getSingleCategory = createAsyncThunk('getSingleCategory', async({id}, thunkAPI)=>{
    try{
        const response = await apiClient.get(`/admin/products/category/${id}`)
        return {populatedSubCategories: response.data.populatedSubCategories, parentLevelCount:response.data.parentLevelCount, id, parentName: response.data.parentName}
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getCategoryNames = createAsyncThunk('getCategoryNames', async({id}, thunkAPI)=>{
    try{
        const response = await apiClient.get(`/admin/products/category/getNames/${id}`)
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getNestedSubcategoryNames = createAsyncThunk('getNestedSubcategoryNames', async({id}, thunkAPI)=>{
    try{
        const response = await apiClient.get(`/admin/products/category/getNestedSubcategoryNames/${id}`)
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getFirstLevelCategories = createAsyncThunk('getFirstLevelCategories', async(_, thunkAPI)=>{
    try{
        const response = await apiClient.get(`/admin/products/category/getFirstLevelCategories`)
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})


export const toggleCategoryStatus = createAsyncThunk('toggleCategoryStatus', async(id, thunkAPI)=>{
    try{
        const response = await apiClient.get(`/admin/products/category/status/${id}`)
        return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const updateCategory = createAsyncThunk('updateCategory', async({formData, id}, thunkAPI)=>{
    try{
        const response = await apiClient.post(`/admin/products/category/edit/${id}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
        return {category: response.data.category, id}
    }
    catch(error){
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

const initialState = {
    categories: [],
    allSubCategories: [],
    everyCategoryNames: [],
    categoryCounts: null,
    populatedSubCategories: {},
    firstLevelCategories: [],
    nestedSubcategoryNames: {},
    blockedCategoryList: [],
    tempDatas: {},
    categoryCreated: false,
    categoryUpdated: false,
    loading: false,
    error: null,
    success:false,
    message: null,
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        resetStates: (state, action)=>{
            state.loading = false
            state.error = null
            state.success = false
            state.message = ''
            state.categoryCreated = false
            state.categoryUpdated = false
        },
        resetSubcategories: (state, action)=>{
            state.populatedSubCategories = {}
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(createCategory.fulfilled, (state, action)=>{
            state.error = null
            state.loading = false
            state.success = true
            state.categoryCreated = true
            state.categories.push(action.payload.category)
        })
        .addCase(createCategory.pending, (state,action)=>{
            state.loading = true
            state.error = null
            state.success = false
        })
        .addCase(createCategory.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
            state.success = true
            state.categoryCreated = false
        })
        .addCase(getAllCategories.fulfilled, (state,action)=>{
            state.error = null
            state.loading = false
            state.success = true
            state.categories = action.payload.categoriesData
            state.categoryCounts = action.payload.categoriesCount
        })
        .addCase(getAllCategories.pending, (state,action)=>{
            state.loading = true
            state.error = null
            state.success = false
        })
        .addCase(getAllCategories.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
            state.success = true
        })
        .addCase(getCategoriesOfType.fulfilled, (state,action)=>{
            state.error = null
            state.loading = false
            state.success = true
            state.categories = action.payload.categoriesData
            state.categoryCounts = action.payload.categoriesCount
        })
        .addCase(getCategoriesOfType.pending, (state,action)=>{
            state.loading = true
            state.error = null
            state.success = false
        })
        .addCase(getCategoriesOfType.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
            state.success = true
        })
        .addCase(getSingleCategory.fulfilled, (state, action) => {
            state.error = null;
            state.loading = false;
            state.populatedSubCategories = {
                subCategories: action.payload.populatedSubCategories,
                parentId: action.payload.id,
                parentName: action.payload.parentName,
                parentLevelCount: action.payload.parentLevelCount,
            };
        
            if (!state.allSubCategories) {
                state.allSubCategories = []; // Ensure allSubCategories is an array
            }
        
            state.populatedSubCategories.subCategories.forEach(subcategory => {
                const existingIndex = state.allSubCategories.findIndex(subcat => subcat._id === subcategory._id);
                if (existingIndex !== -1) {
                    state.allSubCategories[existingIndex] = subcategory;
                } else {
                    state.allSubCategories.push(subcategory);
                }
            });
        })      
        .addCase(getSingleCategory.pending, (state,action)=>{
            state.loading = true
            state.error = null
        })
        .addCase(getSingleCategory.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
        })
        .addCase(getCategoryNames.fulfilled, (state,action)=>{
            state.error = null
            state.loading = false
            state.nestedSubcategoryNames = {nestedSubcategoryNames: action.payload.nestedSubcategoryNames, parentId: action.payload.id}
        })
        .addCase(getCategoryNames.pending, (state,action)=>{
            state.loading = true
            state.error = null
        })
        .addCase(getCategoryNames.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
        })
        .addCase(getNestedSubcategoryNames.fulfilled, (state,action)=>{
            const parentNameObj = action.payload.nestedSubcategoryNames[0]
            const nestedSubcategoryNames = action.payload.nestedSubcategoryNames.slice(1)
            state.error = null
            state.loading = false
            state.nestedSubcategoryNames = {
                parentNameObj,
                subCategoryNamesObj: nestedSubcategoryNames.filter(
                  (subCat) => subCat.parentLevelCount === 1
                ),
              };
        })
        .addCase(getNestedSubcategoryNames.pending, (state,action)=>{
            state.loading = true
            state.error = null
        })
        .addCase(getNestedSubcategoryNames.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
        })
        .addCase(getFirstLevelCategories.fulfilled, (state,action)=>{
            state.error = null
            state.loading = false
            state.firstLevelCategories = action.payload.firstLevelCategories
        })
        .addCase(getFirstLevelCategories.pending, (state,action)=>{
            state.loading = true
            state.error = null
        })
        .addCase(getFirstLevelCategories.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
        })
        .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
            state.success = true;
            state.loading = false;
            state.error = null;
            state.message = action.payload.message
            state.blockedCategoryList = JSON.parse(JSON.stringify(action.payload.blockStatusIdList))
        })
        .addCase(toggleCategoryStatus.pending, (state,action)=>{
            state.loading = true
            state.error = null
            state.categoryUpdated = false
        })
        .addCase(toggleCategoryStatus.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
            state.categoryUpdated = false
        })
        .addCase(updateCategory.fulfilled, (state, action)=>{
            state.error = null
            state.loading = false
            state.categoryUpdated = true
            const updatingCategoryIndex = state.categories.findIndex(category=> category._id === action.payload.id)
            state.categories[updatingCategoryIndex] = action.payload.category
        })
        .addCase(updateCategory.pending, (state,action)=>{
            state.loading = true
            state.error = null
            state.success = false
        })
        .addCase(updateCategory.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
            state.success = true
        })
    }
})

export default categorySlice.reducer
export const {resetStates, resetSubcategories} = categorySlice.actions