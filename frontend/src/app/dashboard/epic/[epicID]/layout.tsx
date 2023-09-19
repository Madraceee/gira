'use client'

import EpicProvider from "@/hooks/epic"
import { ReactElement, useEffect } from "react"


type EpicProps = {
    children : ReactElement
}

export default function Layout({children} : EpicProps){
    return(
        <div className="w-full h-full">
            <EpicProvider>
                {children}
            </EpicProvider>
        </div>
        
    )
}