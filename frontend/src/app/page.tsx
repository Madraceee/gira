'use client'
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-bl from-slate-100 via-slate-300 to-slate-500">
      <span className="text-6xl md:text-8xl font-bold text-center">Welcome to Gira</span>
      <span className="text-2xl md:text-3xl font-semibold text-black/70 text-center">Your next best Agile task Manager</span>
      <div className="w-1/2 flex flex-col md:flex-row justify-center items-center gap-4 pt-5">
        <button className="bg-black/70 text-white p-3 text-2xl rounded-md w-full md:w-1/2 xl:w-1/3 cursor-pointer shadow-md" onClick={()=>router.push("/login")}>Login</button>
        <button className="bg-black/70 text-white p-3 text-2xl rounded-md w-full md:w-1/2 xl:w-1/3 cursor-pointer shadow-md" onClick={()=>router.push("/createUser")}>Create User</button>
      </div>
    </div>
  )
}
