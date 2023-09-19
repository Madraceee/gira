'use client'
import React, { ReactElement,useEffect, useRef, useState } from 'react'
import { concatClasses } from '@/utils/helper'
import "./Modal.css";

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { closeModal } from '@/redux/modal/modalSlice';

export default function Modal(){
    
    const bgRef = useRef<HTMLDivElement>(null)
    const isOpen = useSelector((state:RootState)=>state.modal.isOpen)
    const children = useSelector((state:RootState)=>state.modal.children)
    const header = useSelector((state:RootState)=>state.modal.header)

    const dispatch = useDispatch()

    const firstRender = useRef(true)

    useEffect(() => {
        if (firstRender.current && !isOpen) {
            bgRef.current?.classList?.add('hidden')
            bgRef.current?.classList?.remove('flex')
            firstRender.current = false
            return
        }
        if (!isOpen) {
            bgRef.current?.classList?.add('hidden')
            bgRef.current?.classList?.remove('flex')
        } else {
            bgRef.current?.classList?.remove('hidden')
            bgRef.current?.classList?.add('flex')
        }
    }, [isOpen])

    return (
        <div
            onClick={()=>dispatch(closeModal())}
            ref={bgRef}
            className={concatClasses([
                'fixed overflow-y-auto bg-black/50 top-0 left-0 right-0 bottom-0 z-20 h-full w-full items-center justify-center backdrop-blur-sm hidden',
                isOpen ? ' dialog-bg-in' : '  dialog-bg-out ',
            ])}
        >
            <div className='bg-[#0d111c] h-fit  rounded-md w-full sm:max-w-fit z-50 border border-dialogBorder shadow-dialogBox' onClick={(event)=>event.stopPropagation()}>
                <div className='w-full p-4 flex justify-between text-white mb-2 border-b border-dialogBorder'>
                    <span className='text-xl'>{header}</span>
                    <span className='hover:cursor-pointer flex items-center justify-center' onClick={()=>dispatch(closeModal())}><img className='w-4 h-4' src="/close.png" alt="Close" /></span>
                </div>
                {children !== null && 
                React.cloneElement(children, {
                    className:
                        children.props.className +
                        (isOpen ? ' dialog-in' : ' dialog-out'),
                })}
            </div>
            
        </div>
    )
}