import Loader from "@/components/loader";

export default function Loading(){
    return(
        <div className="w-full flex flex-col justify-around items-center translate-y-full">
            <Loader />
            <span className="text-2xl h-1/2">Loading Epic...</span>
        </div>        
    )
}