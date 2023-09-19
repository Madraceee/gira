'use client'

import ResultDisplay from '@/components/ModalComponents/ResultDisplay';
import { openModal } from '@/redux/modal/modalSlice';
import { RootState } from '@/redux/store';
import { inputDate } from '@/utils/helper';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function YourComponent() {

    const router = useRouter();
    const dispatch = useDispatch()

    const [epicName, setEpicName] = useState('');
    const [epicDesc, setEpicDesc] = useState('');
    const [epicFeatures, setEpicFeatures] = useState('');
    const [epicLink, setEpicLink] = useState('');
    const [epicStartDate, setStartEpicDate] = useState(new Date);

    const token = useSelector((state:RootState)=>state.user.token)

    const submitEpic = async()=>{
        const pattern = /^((http|https):\/\/)?[a-zA-Z0-9\s.,'"!?()\/\-]+$/;

        if(pattern.test(epicName) && pattern.test(epicDesc) && pattern.test(epicFeatures) && pattern.test(epicLink)){
            try{
                const response = await axios.post("http://localhost:8080/epic/createEpic",{
                    "name" : epicName,
                    "desc" : epicDesc,
                    "features" : epicFeatures,
                    "link" : epicLink,
                    "start_date" : epicStartDate.toISOString()
                },{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                })

                if(response.status === 200){
                    dispatch(openModal({header: "Epic",children: <ResultDisplay msg={"Success"}/>}))
                }
            }catch(err:any){
                if(err.response.data){
                    dispatch(openModal({header: "Epic",children: <ResultDisplay msg={err.response.data.error}/>}))
                }
                else{
                    dispatch(openModal({header: "Epic",children: <ResultDisplay msg={"Failure"}/>}))
                }
                console.log(err)
            }
        }
        else{
            dispatch(openModal({header: "Epic",children: <ResultDisplay msg={"Invalid Input"}/>}))
        }
        setEpicName("")
        setEpicDesc("")
        setEpicFeatures("")
        setEpicLink("")
        setStartEpicDate(new Date)
    }

    const inputStyle = "text-xl p-2 border-2 rounded-md"

  return (
    <div className='w-full min-h-[80vh] flex justify-center items-center'>
      <div className='w-11/12 md:w-1/2 flex flex-col gap-2 bg-slate-400/50 p-2 rounded-md'>
        <span className='text-sm text-blue-700 cursor-pointer' onClick={()=>router.push("/dashboard")}>Dashboard</span>
        <span className='text-2xl font-bold text-center'>Enter Epic Details</span>
        <input
            type="text"
            id="epicName"
            className={inputStyle}
            placeholder="Enter Epic name"
            value={epicName}
            onChange={(e) => setEpicName(e.target.value)}
        />
        <input
            type="text"
            id="epicDesc"
            className={inputStyle}
            placeholder="Enter Epic Description"
            value={epicDesc}
            onChange={(e) => setEpicDesc(e.target.value)}
        />
        <input
            type="text"
            id="epicFeatures"
            className={inputStyle}
            placeholder="Enter Features"
            value={epicFeatures}
            onChange={(e) => setEpicFeatures(e.target.value)}
        />
        <input
            type="text"
            id="epicLink"
            className={inputStyle}
            placeholder="Repo URL"
            value={epicLink}
            onChange={(e) => setEpicLink(e.target.value)}
        />
        <div className='w-full flex items-center justify-between'>
            <span className='text-2xl'>Start Date:</span>
            <input
                type="date"
                className={inputStyle}
                value={inputDate(epicStartDate)}
                onChange={(e) => setStartEpicDate(new Date(e.target.value))}
            />
        </div>
        <button className='w-full text-xl bg-blue-300 p-2 rounded-md hover:bg-blue-500 cursor-pointer transition-colors ease-linear duration-300' onClick={submitEpic}>
            Submit
        </button></div>
    </div>
  );
}

export default YourComponent;
