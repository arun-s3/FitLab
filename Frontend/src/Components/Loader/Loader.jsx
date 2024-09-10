import React from 'react'
import HashLoader from 'react-spinners/HashLoader'

export function CustomHashLoader({loading}){

    const loaderCssOverride= {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };

    return(
        <HashLoader loading={loading} cssOverride={loaderCssOverride} size={20} aria-label="Loading HashLoader" 
                                                     color="rgba(159, 42, 240, 1)" data-testid="loader"/> 
    )
}