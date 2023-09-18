import { EpicDetailsFull, EpicPerms, SprintDetails, useEpic } from "@/hooks/epic";
import { dateToString } from "@/utils/helper";

export default function EpicDetails({epicDetails,sprintDetails} : {epicDetails: EpicDetailsFull, sprintDetails : SprintDetails[]}){
    const headingStyle = "font-bold text-xl";
    const groupStyle = "whitespace-pre-wrap break-words";
    
    return(
        <div className="w-full bg-black/80 text-white/90 text-lg p-2 rounded-b-md flex flex-col gap-3 lg:flex-row ">
            <div className="w-full lg:w-1/2 flex flex-col gap-1">
                <p className={groupStyle}><span className={headingStyle}>Epic Name: </span>{epicDetails.EpicName}</p>
                <p className={groupStyle}><span className={headingStyle}>Epic Description: </span>{epicDetails.EpicDescription}</p>
                <p className={groupStyle}><span className={headingStyle}>Epic Features: </span>{epicDetails.EpicFeatures}</p>
                {epicDetails.EpicLink.Valid && <p className={groupStyle}><span className={headingStyle}>Epic Link: </span>{epicDetails.EpicLink.String}</p>}
                <p className={groupStyle}><span className={headingStyle}>Epic Start Date: </span>{dateToString(epicDetails.EpicStartDate)}</p>
                {epicDetails.EpicEndDate.Valid && <p className={groupStyle}><span className={headingStyle}>Epic End Date: </span>{dateToString(epicDetails.EpicEndDate.Time)}</p>}
            </div>
            
            <div className="w-full lg:w-1/2">
                {sprintDetails.length > 0 && 
                    <>
                        <h1 className={headingStyle}>Sprint Details</h1>
                        {sprintDetails.map((sprint,index)=>{
                            return (
                                <div key={index} className="w-full flex flex-row justify-between ">
                                    <span>Sprint-{sprint.SprintID}</span>
                                    <span>{dateToString(sprint.SprintStartDate)}</span>
                                    <span>{dateToString(sprint.SprintEndDate)}</span>
                                </div>
                            )
                        })}
                    </>
                }
            </div>            
        </div>
    )   
} 