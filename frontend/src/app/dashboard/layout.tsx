import NavBar from "@/components/Navbar";
import { AppProps } from "next/app";
import { ReactElement } from "react";

type DashBoardProp = AppProps & {
    children : ReactElement
}

export default function Layout({children} : DashBoardProp){
    return(
        <>
            <NavBar />
            {children}           
        </>
    )
}