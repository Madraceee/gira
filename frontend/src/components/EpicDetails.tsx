import { EpicDetailsFull, SprintDetails } from "@/hooks/epic";

export default function EpicDetails({epicDetails,sprintDetails} : {epicDetails: EpicDetailsFull, sprintDetails : SprintDetails[]}){
    const headingStyle = "font-bold";
    const groupStyle = "whitespace-pre-wrap break-words";
    return(
        <div className="w-full bg-black/80 text-white/90 text-lg p-2 rounded-b-md flex flex-col gap-3 lg:flex-row ">
            <div className="w-full lg:w-1/2 flex flex-col gap-1">
                <p className={groupStyle}><span className={headingStyle}>Epic Name: </span>{epicDetails.EPICNAME}</p>
                <p className={groupStyle}><span className={headingStyle}>Epic Description: </span>{epicDetails.EPICDESCRIPTION}</p>
                <p className={groupStyle}><span className={headingStyle}>Epic Features: </span>{epicDetails.EPICFEATURES}</p>
                <p className={groupStyle}><span className={headingStyle}>Epic Link: </span>{epicDetails.EPICLINK}</p>
                <p className={groupStyle}><span className={headingStyle}>Epic Start Date: </span>{epicDetails.EPICSTARTDATE}</p>
                <p className={groupStyle}><span className={headingStyle}>Epic End Date: </span>{epicDetails.EPICENDDATE}</p>
            </div>
            {sprintDetails.length > 0 && 
            <div className="w-full lg:w-1/2">
                <h1 className={headingStyle+" text-xl"}>Sprint Details</h1>
                {sprintDetails.map((sprint,index)=>{
                    return (
                        <div key={index} className="w-full flex flex-row justify-between ">
                            <span>Sprint-{sprint.SPRINTNAME}</span>
                            <span>{sprint.SPRINTSTARTDATE}</span>
                            <span>{sprint.SPRINTENDDATE}</span>
                        </div>
                    )
                })}
            </div>
            }
            
        </div>
    )   
} 