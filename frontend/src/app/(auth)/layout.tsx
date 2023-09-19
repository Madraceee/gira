import { AppProps } from "next/app";
import { ReactElement } from "react";

type LayoutProp = AppProps & {
    children : ReactElement
}

export default function Layout({children} : LayoutProp){
    return(
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="w-11/12 md:w-1/2 lg:w-1/3">
                <div className="flex flex-col items-center gap-2 p-2 pt-3 pb-3 bg-gray-50 rounded-md border-gray-50 shadow-md">
                    {children}
                </div>
            </div>            
        </div>
    )
}