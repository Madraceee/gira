'use client'

import EpicProvider from "@/hooks/epic"
import { AppProps } from "next/app"
import { ReactElement } from "react"

type EpicProps = AppProps & {
    children : ReactElement
}

export default function Layout({children} : EpicProps){
    return(
        <EpicProvider>
            {children}
        </EpicProvider>
    )
}