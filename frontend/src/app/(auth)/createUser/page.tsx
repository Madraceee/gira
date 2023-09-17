'use client'
import Loader from "@/components/loader"
import { closeModal, openModal } from "@/redux/modal/modalSlice"
import axios from "axios"
import Link from "next/link"
import { useState } from "react"
import { useDispatch } from "react-redux"

type CreateUserPayload = {
    email : string,
    name : string,
    password : string,
    user_type : string
}

export default function Page(){
    const InputClass = "w-11/12 border-[1px]  rounded-sm border-slate-300 p-1 focus:outline-none focus-visible:border-slate-500 text-lg"
    
    const [email,setEmail] = useState<string>("");
    const [name,setName] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [confirmpassword,setConfirmPassword] = useState<string>("");
    const [role,SetRole] = useState<string>("")
    const [error,setError] = useState<string>("");
    const [isLoading,setIsLoading] = useState<boolean>(false);

    const dispatch = useDispatch();

    const submitCreds = async ()=>{
        const namePattern = /^[A-Z ]{3,}$/i;
        const emailPattern = /^[A-Z0-9._]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const passwordPattern = /^[A-Z0-9!@#$]+$/i;

        if(!namePattern.test(name)){
            if(name.length < 3){
                setError("Short name");
                return;
            }
            setError("Only alphabets allowed");
            return;
        }

        if(!emailPattern.test(email)){
            setError("Invalid Email Pattern");
            return;
        }
        if(!passwordPattern.test(password) || !passwordPattern.test(confirmpassword)){
            setError("Only Alphabets,digits and !@#$ are allowed in password");
            return;
        }

        if(password !== confirmpassword){
            setError("Password mismatch");
            return;
        }

        if(role === ""){
            setError("Choose role")
            return
        }

        setError("")
        setIsLoading(true)

        const jsonPayload : CreateUserPayload = {
            email : email,
            name : name,
            password : password,
            user_type : role
        }

        try{
            const response = await axios.post("http://localhost:8080/user/createUser",jsonPayload,{
                headers : {
                    'Content-Type': 'application/json',
                },
            })
            setIsLoading(false)
            dispatch(openModal({
                header: "",
                children: <UserCreationSuccess 
                            msg={response.data}
                        />
            }))
            setPassword("")
            setConfirmPassword("")
        }catch (err :any ){
            setIsLoading(false)
            if(err.response){
                console.log(err.response.status)
                setPassword("")
                setConfirmPassword("")
                setError(err.response.data.error)
            }
            else{
                alert("Server Error pls try again later")
            }
        }
        
    }
    
    return (
        <>
            <p className="text-start w-11/12 text-lg">Create User</p>
            <input type="text" name="name" id="name" placeholder="Enter Name" className={InputClass} value={name} onChange={(e)=>setName(e.target.value)}/>
            <input type="email" name="email" id="email" placeholder="Enter Email" className={InputClass} value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" name="confirm-password" id="password" placeholder="Enter Password" className={InputClass} value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <input type="password" name="confirm-password" id="confirm-password" placeholder="Confirm Password" className={InputClass} value={confirmpassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
            <div className="w-11/12 flex flex-col items-start pt-3 pb-3">
                <p className="min-w-full text-left font-semibold">Select Role</p>
                <div className="flex items-center gap-2">
                    <input type="radio" value="Master" id="master" name="role" onChange={()=>SetRole("MASTER")}/> <label className="text-sm">Master</label>
                </div>
                <div className="flex items-center gap-2">
                    <input type="radio" value="Master" id="member" name="role" onChange={()=>SetRole("MEMBER")}/> <label className="text-sm">Member</label>
                </div>                
            </div>
            <div className="text-red-500 w-11/12 text-start text-xs">{error}</div>
            <button className="w-11/12 bg-gray-800 hover:bg-black transition-colors ease-in-out duration-300 text-white pt-1 pb-1 border-[1px] rounded-md" onClick={submitCreds} disabled={isLoading}>
                {isLoading ? <Loader /> : "Submit"}
            </button>
            <p>Already a member? <Link href="/login" className="text-blue-500 hover:cursor-pointer underline">Login</Link></p> 
        </>
    )
}

function UserCreationSuccess({msg} : {msg : string}){
    const dispatch = useDispatch()
    return(
        <div className="max-w-md flex flex-col h-[100px] p-5 justify-center items-center gap-6">
            <h1 className="text-white text-center">{msg}</h1>
            <Link href="/login" className="w-full" >
                <button className="bg-green-400 w-full rounded-md" onClick={()=>dispatch(closeModal())}>
                    Go to Login
                </button>
            </Link>            
        </div>
    )
}