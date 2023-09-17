import { TaskDetails } from "@/hooks/epic";

export default function TaskPreview({taskPreview,showTask} : {taskPreview : TaskDetails,showTask: (taskID:string)=>void }){
    let cardColor = "bg-black/20 "
    if(taskPreview.TASKSTATUS === "NOT STARTED")
        cardColor = "bg-black/20 "
    if(taskPreview.TASKSTATUS === "BUILDING")
        cardColor = "bg-blue-300 "
    if(taskPreview.TASKSTATUS === "TESTING")
        cardColor = "bg-orange-300 "
    if(taskPreview.TASKSTATUS === "REVIEW")
        cardColor = "bg-orange-300 "
    if(taskPreview.TASKSTATUS === "COMPLETED")
        cardColor = "bg-green-300 "
    if(taskPreview.TASKSTATUS === "HALTED")
        cardColor = "bg-red-400 "
    
    return(
        <div className={`${cardColor} w-full h-20 flex flex-row flex-wrap p-2 gap-2 cursor-pointer flex-grow`} onClick={()=>showTask(taskPreview.TASKID)}>
            <p className="w-full font-bold text-xl">{taskPreview.TASKNAME}</p>
            <div className="w-full flex flex-row justify-between items-center">
                <p className="text-sm w-fit">Status: {taskPreview.TASKSTATUS}</p>
                <p className="text-sm w-fit" >{taskPreview.TASKSPRINTID !== "" && `Sprint: ${taskPreview.TASKSPRINTID}`}</p>
                <p className="text-sm w-fit">{taskPreview.TASKENDDATE !== "" && `End Date: ${taskPreview.TASKENDDATE}`}</p>
            </div>
            
        </div>
    )
}