import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../Utils/axiosConfig'

export const createCategory = createAsyncThunk('createCategory', async({formData}, thunkAPI)=>{
    try{
        console.log("Inside createCategory createAsyncThunk")
        const response = await axios.post('/admin/products/category/add', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        console.log("returning success response from createCategory createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of createCategory from categorySlice")
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getAllCategories = createAsyncThunk('getAllCategories', async({isAdmin}, thunkAPI)=>{
    try{
        console.log("Inside createCategory createAsyncThunk")
        const response = await axios.get(`/admin/products/category/?isAdmin=${isAdmin ? true : false}`, {withCredentials: true})
        console.log("returning success response from getAllCategories createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of getAllCategories from categorySlice")
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

// export const getEveryCategoryNames = createAsyncThunk('getEveryCategoryNames', async(thunkAPI)=>{
//     try{
//         console.log("Inside getEveryCategoryNames createAsyncThunk")
//         const response = await axios.get('/admin/products/category/everyCategoryNames', {withCredentials: true})
//         console.log("returning success response from getEveryCategoryNames createAsyncThunk..."+JSON.stringify(response.data))
//         return response.data
//     }
//     catch(error){
//         console.log("inside catch of getEveryCategoryNames from categorySlice")
//         const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
//         return thunkAPI.rejectWithValue(errorMessage)
//     }
// })

export const getCategoriesOfType = createAsyncThunk('getCategoriesOfType', async({status}, thunkAPI)=>{
    try{
        console.log("Inside getCategoriesOfType createAsyncThunk")
        const response = await axios.get(`/admin/products/category/?status=${status}&`, {withCredentials: true})
        console.log("returning success response from getCategoriesOfType createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of getCategoriesOfType from categorySlice")
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getSingleCategory = createAsyncThunk('getSingleCategory', async({id}, thunkAPI)=>{
    try{
        console.log("Inside getSingleCategory createAsyncThunk")
        console.log("id from categorySlice -->", id)
        const response = await axios.get(`/admin/products/category/${id}`, {withCredentials: true})
        console.log("returning success response from getSingleCategory createAsyncThunk..."+JSON.stringify(response.data))
        return {populatedSubCategories: response.data.populatedSubCategories, parentLevelCount:response.data.parentLevelCount, id, parentName: response.data.parentName}
    }
    catch(error){
        console.log("inside catch of getSingleCategory from categorySlice")
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getCategoryNames = createAsyncThunk('getCategoryNames', async({id}, thunkAPI)=>{
    try{
        console.log("Inside getCategoryNames createAsyncThunk")
        console.log("id from categorySlice -->", id)
        const response = await axios.get(`/admin/products/category/getNames/${id}`, {withCredentials: true})
        console.log("returning success response from getCategoryNames createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of getCategoryNames from categorySlice")
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getNestedSubcategoryNames = createAsyncThunk('getNestedSubcategoryNames', async({id}, thunkAPI)=>{
    try{
        console.log("Inside getNestedSubcategoryNames createAsyncThunk")
        console.log("id from categorySlice -->", id)
        const response = await axios.get(`/admin/products/category/getNestedSubcategoryNames/${id}`, {withCredentials: true})
        console.log("returning success response from getCategoryNames createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of getNestedSubcategoryNames from categorySlice")
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const getFirstLevelCategories = createAsyncThunk('getFirstLevelCategories', async(thunkAPI)=>{
    try{
        console.log("Inside getFirstLevelCategories createAsyncThunk")
        const response = await axios.get(`/admin/products/category/getFirstLevelCategories`, {withCredentials: true})
        console.log("returning success response from getFirstLevelCategories createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of getFirstLevelCategories from categorySlice")
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})


export const toggleCategoryStatus = createAsyncThunk('toggleCategoryStatus', async(id, thunkAPI)=>{
    try{
        console.log("Inside toggleCategoryStatus createAsyncThunk")
        const response = await axios.get(`/admin/products/category/status/${id}`,{withCredentials:true})
        console.log("returning success response from toggleCategoryStatus createAsyncThunk..."+JSON.stringify(response.data))
        return response.data
    }
    catch(error){
        console.log("inside catch of toggleCategoryStatus from productSlice")
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong.  Please try again later.'
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const updateCategory = createAsyncThunk('updateCategory', async({formData, id}, thunkAPI)=>{
    try{
        console.log("Inside updateCategory createAsyncThunk")
        const response = await axios.post(`/admin/products/category/edit/${id}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
        console.log("returning success response from updateCategory createAsyncThunk..."+JSON.stringify(response.data))
        return {category: response.data.category, id}
    }
    catch(error){
        console.log("inside catch of updateCategory from categorySlice")
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
            state.categoryCreated = false
            state.categoryUpdated = false
            console.log(`Reseting states in categorySlice--> state.productCreated-${state.success}, state.productUpdated-${state.message}`)
        },
        resetSubcategories: (state, action)=>{
            state.populatedSubCategories = {}
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(createCategory.fulfilled, (state, action)=>{
            console.log("action.payload.product-->", JSON.stringify(action.payload.category))
            state.error = false
            state.loading = false
            state.success = true
            state.categoryCreated = true
            state.categories.push(action.payload.category)
        })
        .addCase(createCategory.pending, (state,action)=>{
            state.loading = true
            state.error = false
            state.success = false
        })
        .addCase(createCategory.rejected, (state,action)=>{
            state.loading = false
            state.error = true
            state.success = true
            state.categoryCreated = false
        })
        .addCase(getAllCategories.fulfilled, (state,action)=>{
            console.log("action.payload.categoriesData-->", JSON.stringify(action.payload.categoriesData))
            state.error = false
            state.loading = false
            state.success = true
            state.categories = action.payload.categoriesData
            state.categoryCounts = action.payload.categoriesCount
        })
        .addCase(getAllCategories.pending, (state,action)=>{
            state.loading = true
            state.error = false
            state.success = false
        })
        .addCase(getAllCategories.rejected, (state,action)=>{
            state.loading = false
            state.error = true
            state.success = true
        })
        // .addCase(getEveryCategoryNames.fulfilled, (state,action)=>{
        //     console.log("action.payload.categoriesData-->", JSON.stringify(action.payload.categoriesData))
        //     state.error = false
        //     state.loading = false
        //     state.success = true
        //     state.everyCategoryNames = action.payload.everyCategoryNames
        // })
        // .addCase(getEveryCategoryNames.pending, (state,action)=>{
        //     state.loading = true
        //     state.error = false
        //     state.success = false
        // })
        // .addCase(getEveryCategoryNames.rejected, (state,action)=>{
        //     state.loading = false
        //     state.error = true
        //     state.success = true
        // })
        .addCase(getCategoriesOfType.fulfilled, (state,action)=>{
            console.log("action.payload.categoriesData-->", JSON.stringify(action.payload.categoriesData))
            state.error = false
            state.loading = false
            state.success = true
            state.categories = action.payload.categoriesData
            state.categoryCounts = action.payload.categoriesCount
        })
        .addCase(getCategoriesOfType.pending, (state,action)=>{
            state.loading = true
            state.error = false
            state.success = false
        })
        .addCase(getCategoriesOfType.rejected, (state,action)=>{
            state.loading = false
            state.error = true
            state.success = true
        })
        // .addCase(getSingleCategory.fulfilled, (state,action)=>{
        //     console.log("action.payload.categoriesData-->", JSON.stringify(action.payload.populatedCategory))
        //     // const populatedCategory = action.payload.populatedCategory
        //     // state.categories.find(cat=> {
        //     //     if(!cat.subCategory){
        //     //         return cat._id==populatedCategory._id
        //     //     }  
        //     // })
        //     // if(state.cate)
        //     state.error = false
        //     state.loading = false
        //     state.populatedSubCategories = {subCategories: action.payload.populatedSubCategories, parentId: action.payload.id, parentName: action.payload.parentName, parentLevelCount: action.payload.parentLevelCount}
        //     state.populatedSubCategories.subCategories.forEach(subcategory=> {
        //         if(state.allSubCategories && state.allSubCategories.length > 0 && state.allSubCategories.findIndex(subcat=> subcat._id === subcategory._id)){
        //             console.log("Inside if--state.allSubCategories.findIndex(subcat=> subcat._id === subcategory._id-")
        //             const updatingCategoryIndex = state.allSubCategories.findIndex(subcat=> subcat._id === subcategory._id)
        //             console.log("updatingCategoryIndex-->",updatingCategoryIndex)
        //             state.allSubCategories[updatingCategoryIndex] = subcategory
        //             console.log("state.allSubCategories[updatingCategoryIndex]-->", JSON.stringify(state.allSubCategories[updatingCategoryIndex]))
        //         }else{
        //             console.log("Inside else--state.allSubCategories.findIndex(subcat=> subcat._id === subcategory._id-")
        //             console.log("allSubCategories.length", state.allSubCategories?.length)
        //             state.allSubCategories.push(subcategory)
        //         }
        //     })
        //     console.log("state.populatedSubCategories------>", JSON.stringify(state.populatedSubCategories))
        // })
        .addCase(getSingleCategory.fulfilled, (state, action) => {
            console.log("action.payload.categoriesData-->", JSON.stringify(action.payload.populatedCategory));
            state.error = false;
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
            console.log("STATE.ALLSUBCATEGORIES---->", JSON.stringify(state.allSubCategories))
            console.log("state.populatedSubCategories------>", JSON.stringify(state.populatedSubCategories));
        })      
        .addCase(getSingleCategory.pending, (state,action)=>{
            state.loading = true
            state.error = false
        })
        .addCase(getSingleCategory.rejected, (state,action)=>{
            state.loading = false
            state.error = true
        })
        .addCase(getCategoryNames.fulfilled, (state,action)=>{
            console.log("action.payload.nestedSubcategoryNames-->", JSON.stringify(action.payload.nestedSubcategoryNames))
            state.error = false
            state.loading = false
            state.nestedSubcategoryNames = {nestedSubcategoryNames: action.payload.nestedSubcategoryNames, parentId: action.payload.id}
        })
        .addCase(getCategoryNames.pending, (state,action)=>{
            state.loading = true
            state.error = false
        })
        .addCase(getCategoryNames.rejected, (state,action)=>{
            state.loading = false
            state.error = true
        })
        .addCase(getNestedSubcategoryNames.fulfilled, (state,action)=>{
            console.log("action.payload.nestedSubcategoryNames-->", JSON.stringify(action.payload.nestedSubcategoryNames))
            const parentNameObj = action.payload.nestedSubcategoryNames[0]
            const nestedSubcategoryNames = action.payload.nestedSubcategoryNames.slice(1)
            console.log("parentNameObj from slice--->", JSON.stringify(parentNameObj))
            console.log("nestedSubcategoryNamesObj from slice--->",JSON.stringify(nestedSubcategoryNames))
            // console.log("parentLevelCounts from slice--->", parentLevelCounts)
            state.error = false
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
            state.error = false
        })
        .addCase(getNestedSubcategoryNames.rejected, (state,action)=>{
            state.loading = false
            state.error = true
        })
        .addCase(getFirstLevelCategories.fulfilled, (state,action)=>{
            console.log("action.payload.FirstLevelCategories-->", JSON.stringify(action.payload.firstLevelCategories))
            state.error = false
            state.loading = false
            state.firstLevelCategories = action.payload.firstLevelCategories
        })
        .addCase(getFirstLevelCategories.pending, (state,action)=>{
            state.loading = true
            state.error = false
        })
        .addCase(getFirstLevelCategories.rejected, (state,action)=>{
            state.loading = false
            state.error = true
        })
        // .addCase(toggleCategoryStatus.fulfilled, (state,action)=>{
        //     state.success = true
        //     state.message = action.payload.categoryBlocked
        //     state.loading = false
        //     state.error = false
        //     if(state.categories.some(category=> category._id === action.payload.categoryId)){
        //         console.log("Inside state.categories.findIndex")
        //         const updatingCategoryIndex = state.categories.findIndex(category=> category._id === action.payload.categoryId)
        //         console.log("updatingCategoryIndex-->",updatingCategoryIndex)
        //         state.categories[updatingCategoryIndex].isBlocked = state.message === 'Blocked'? true : false
        //         console.log("state.categories[updatingCategoryIndex].isBlocked-->", state.categories[updatingCategoryIndex].isBlocked)
        //     }
        //     if(state.allSubCategories.some(scat=> scat._id === action.payload.categoryId)){
        //         console.log("Inside state.allSubCategories.findIndex")
        //         const updatingCategoryIndex = state.allSubCategories.findIndex(category=> category._id === action.payload.categoryId)
        //         console.log("updatingCategoryIndex-->",updatingCategoryIndex)
        //         state.allSubCategories[updatingCategoryIndex].isBlocked = state.message === 'Blocked'? true : false
        //         console.log("state.categories[updatingCategoryIndex].isBlocked-->", state.allSubCategories[updatingCategoryIndex].isBlocked)
        //     }
        // })
        
        // .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
        //     state.success = true;
        //     // state.message = categoryBlocked;
        //     state.loading = false;
        //     state.error = false;
        
        //     const categoryStatusToggler = (categories, blockStatusIdList) => 
        //         categories.map(cat => {
        //             const matchedStatus = blockStatusIdList.find(list => list.id === cat._id);
        //             if (matchedStatus) {
        //                 console.log("INSIDE categories.map, if (matchedStatus)--->", JSON.stringify({ ...cat, isBlocked: matchedStatus.status === 'Blocked' }))
        //                 return { ...cat, isBlocked: matchedStatus.status === 'Blocked' };
        //             }
        //             console.log("INSIDE categories.map, else (matchedStatus)--->", JSON.stringify(cat))
        //             return cat;
        //         });
        
        //     const matchFound = state.categories.some(cat =>
        //         action.payload.blockStatusIdList.some(list => cat._id === list.id)
        //     );
        
        //     if (matchFound) {
        //         state.allSubCategories = categoryStatusToggler(state.allSubCategories, action.payload.blockStatusIdList);
        //         state.categories = categoryStatusToggler(state.categories, action.payload.blockStatusIdList);
        //     } else {
        //         state.allSubCategories = categoryStatusToggler(state.allSubCategories, action.payload.blockStatusIdList);

        //     } 
        // })
        .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
            state.success = true;
            state.loading = false;
            state.error = false;
            state.message = action.payload.message
            state.blockedCategoryList = JSON.parse(JSON.stringify(action.payload.blockStatusIdList))
        
            // const { blockStatusIdList } = action.payload || {};
            // if (!blockStatusIdList || blockStatusIdList.length === 0) {
            //     console.error("blockStatusIdList is empty or undefined");
            //     return;
            // }
        
            // // Recursive function to update categories and nested subcategories
            // const categoryStatusToggler = (categories, blockStatusIdList) =>
            //     categories.map(cat => {
            //         const matchedStatus = blockStatusIdList.find(list => list.id === cat._id);
            //         const isBlocked = matchedStatus ? matchedStatus.status === 'Blocked' : cat.isBlocked;
        
            //         return {
            //             ...cat,
            //             isBlocked,
            //         };
            //     });
        
            // state.allSubCategories = categoryStatusToggler(state.allSubCategories, blockStatusIdList);
            // state.categories = categoryStatusToggler(state.categories, blockStatusIdList);
            // state.allSubCategories = JSON.parse(JSON.stringify(categoryStatusToggler([...state.allSubCategories], blockStatusIdList)));
            // state.categories = JSON.parse(JSON.stringify(categoryStatusToggler([...state.categories], blockStatusIdList)));

        })

        .addCase(toggleCategoryStatus.pending, (state,action)=>{
            state.loading = true
            state.error = false
            state.categoryUpdated = false
        })
        .addCase(toggleCategoryStatus.rejected, (state,action)=>{
            state.loading = false
            state.error = true
            state.categoryUpdated = false
        })
        .addCase(updateCategory.fulfilled, (state, action)=>{
            console.log("action.payload.product-->", JSON.stringify(action.payload.category))
            state.error = false
            state.loading = false
            state.categoryUpdated = true
            const updatingCategoryIndex = state.categories.findIndex(category=> category._id === action.payload.id)
            state.categories[updatingCategoryIndex] = action.payload.category
            console.log("state.categories[updatingCategoryIndex]-->", JSON.stringify(state.categories[updatingCategoryIndex]))
        })
        .addCase(updateCategory.pending, (state,action)=>{
            state.loading = true
            state.error = false
            state.success = false
        })
        .addCase(updateCategory.rejected, (state,action)=>{
            state.loading = false
            state.error = true
            state.success = true
        })
    }
})

export default categorySlice.reducer
export const {resetStates, resetSubcategories} = categorySlice.actions