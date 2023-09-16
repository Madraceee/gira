'use client'
import NavBar from "@/components/Navbar"
import { RootState } from "@/redux/store"
import { useRouter } from 'next/navigation'
import { useEffect } from "react"
import { useSelector } from "react-redux"

export default function Home() {

  const isLoggedIn = useSelector((state:RootState)=>state.user.isLoggedIn)
  const router = useRouter()


  useEffect(()=>{
    if(isLoggedIn === true){
      
      //router.push("/login")
    }
  },[])

  return (
    <div>
      Welcome to Name
    </div>
  )
}
