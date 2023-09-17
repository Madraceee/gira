'use client'
import Loader from "@/components/loader"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { UserState } from "@/redux/user/userSlice"
import { login } from "@/redux/user/userSlice"
import axios, { AxiosError } from "axios"
import { openModal } from "@/redux/modal/modalSlice"
import { useRouter } from "next/navigation"
import { RootState } from "@/redux/store"

type LoginPayload = {
    email : string,
    password : string
}

export default function Page(){
    const InputClass = "w-11/12 border-[1px]  rounded-sm border-slate-300 p-1 focus:outline-none focus-visible:border-slate-500 text-lg"
    
    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [error,setError] = useState<string>("");
    const [isLoading,setIsLoading] = useState<boolean>(false);

    const dispatch = useDispatch()
    const router = useRouter();

    const  submitCreds = async ()=>{
        const emailPattern = /^[A-Z0-9._]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const passwordPattern = /^[A-Z0-9!@#$]+$/i;

        if(!emailPattern.test(email)){
            setError("Invalid Email Pattern");
            return;
        }
        if(!passwordPattern.test(password)){
            setError("Only Alphabets,digits and !@#$ are allowed in password");
            return;
        }
        setError("");
        setIsLoading(true);

        const jsonPayload : LoginPayload = {
            email : email,
            password: password
        }
        try{
            const response = await axios.post("http://localhost:8080/user/login",jsonPayload,{
                headers : {
                    'Content-Type': 'application/json',
                },
            })
            setIsLoading(false)
            dispatch(login(response.data))
            router.push("/dashboard")
        }catch (err :any ){
            setIsLoading(false)
            if(err.response){
                console.log(err.response.status)
                setError(err.response.data.error)
            }
            else{
                alert("Server Error pls try again later")
            }
        }

    }
    
    const isLoggedIn = useSelector((state:RootState)=>state.user.isLoggedIn)
    useEffect(()=>{
        if(isLoggedIn === true){
            router.push("/dashboard")
        }
    },[])    
    
    return (
        <>
            <p className="text-start w-11/12 text-lg">Login</p>
            <input type="email" name="email" id="email" placeholder="Enter Email" className={InputClass} value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" name="password" id="password" placeholder="Enter Password" className={InputClass} value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <div className="text-red-500 w-11/12 text-start text-xs">{error}</div>
            <button className="w-11/12 bg-gray-800 hover:bg-black transition-colors ease-in-out duration-300 text-white pt-1 pb-1 border-[1px] rounded-md" onClick={submitCreds} disabled={isLoading}>
                {isLoading ? <Loader /> : "Submit"}
            </button>
            <p>New user? <Link href="/createUser" className="text-blue-500 hover:cursor-pointer underline">Create Account</Link></p>
        </>
    )
}