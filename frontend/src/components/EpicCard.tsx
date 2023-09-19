type EpicCardProps = {
    epicId : string,
    epicCardDesign : string,
    epicName : string,
    epicDesc : string,
    epicStartDate: string,
    epicEndDate: string,
    handleClick : (epicId: string)=>void
}

export default function EpicCard({epicId,epicCardDesign,epicDesc,epicEndDate,epicName,epicStartDate,handleClick} : EpicCardProps){
    return(
        <div className={`${epicCardDesign} flex flex-col items-start justify-start p-2 gap-2`} onClick={()=>handleClick(epicId)}>
            <p className="text-2xl font-bold">{epicName}</p>
            <div>
                <p className="w-full max-h-[200px] md:max-h-[150px] overflow-hidden"><span className="font-bold">Desc: </span>{epicDesc}</p>
            </div>
            <p>Start Date:{epicStartDate}</p>
            {epicEndDate !== "" && <p>End Date:{epicEndDate}</p>}
            
        </div>
    )
}