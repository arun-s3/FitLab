import React from 'react'
import {HashLoader, PropagateLoader, PacmanLoader, ScaleLoader, PuffLoader} from 'react-spinners'


export function CustomHashLoader({loading, color, customStyle}){

    const loaderCssOverride= {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
        ...customStyle
    };

    return(
        <HashLoader loading={loading} cssOverride={loaderCssOverride} size={20}
                                                     color={color? color : "rgba(159, 42, 240, 1)"} data-testid="loader"/> 
    )
}

export function CustomPacmanLoader({loading, size}){

    const loaderCssOverride= {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };

    return(
        <PacmanLoader loading={loading} cssOverride={loaderCssOverride} size={size} 
                                                     color="rgba(159, 42, 240, 1)" data-testid="loader"/> 
    )
}

export function CustomPropagateLoader({loading, size}){

    const loaderCssOverride= {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };

    return(
        <PropagateLoader loading={loading} cssOverride={loaderCssOverride} size={size} 
                                                     color="rgba(159, 42, 240, 1)" data-testid="loader"/> 
    )
}

export function CustomScaleLoader({loading, size}){

    const loaderCssOverride= {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };

    return(
        <ScaleLoader loading={loading} cssOverride={loaderCssOverride} size={size} 
                                                     color="rgba(159, 42, 240, 1)" data-testid="loader"/> 
    )
}

export function CustomPuffLoader({loading, color, customStyle}){

    const loaderCssOverride= {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
        ...customStyle
    };

    return(
        <PuffLoader loading={loading} cssOverride={loaderCssOverride} size={20} 
                                                     color={color? color : "rgba(159, 42, 240, 1)"} data-testid="loader"/> 
    )
}