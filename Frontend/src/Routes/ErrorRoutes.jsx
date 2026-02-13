import React from 'react'
import {Route, Routes} from 'react-router-dom'

import RestrictedEntryRoutes from '../Components/RestrictedEntryRoutes/RestrictedEntryRoutes'

import ErrorPage403 from '../Pages/Errors/403ErrorPage'
import ErrorPage401 from '../Pages/Errors/401ErrorPage'
import ErrorPage404 from '../Pages/Errors/404ErrorPage'


export default function ErrorRoutes(){
    
    return (
        <Routes>
            <Route element={<RestrictedEntryRoutes redirectTo='/error/404' />}>
                <Route path='401' element={<ErrorPage401 />} />
                <Route path='403' element={<ErrorPage403 />} />
            </Route>

            <Route path='404' element={<ErrorPage404 />} />
        </Routes>
    )
    
}