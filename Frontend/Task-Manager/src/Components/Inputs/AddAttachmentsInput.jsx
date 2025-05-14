import React,{useState} from 'react'
import{HiMiniPlus,HiOutlineTrash} from 'react-icons/hi2'
import { LuPaperclip } from 'react-icons/lu'

const AddAttachmentsInput = ({attachments,setAttachments}) => {

    const [option,setOption]=useState("");
    //function to handle the adding an option
    const handleAddOption=()=>{
        if(option.trim()){
            setAttachments([...attachments,option.trim()]);
            setOption("");
        }
    }
    //function to handle the deleting an option
    const handleDeleteOption=(index)=>{
        const updatedArr=attachments.filter((_,i)=>i!==index);
        setAttachments(updatedArr);
    };
  return (
    <div>
        {attachments.map((item,index)=>(
            <div 
            key={index} 
            className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2'>
             
                <div className="flex1 flex items-center gap-3 border border-gray-100">
                <LuPaperclip className='text-gray-400' />
                <p className='text-xs text-black'>{item}</p>
                </div>
                <button 
                className='cursor-pointer'
                onClick={()=>{handleDeleteOption(index);
                }}
            >
                <HiOutlineTrash className='text-lg text-red-500' />
            </button>
            </div>
                    
        ))}

        <div className='flex items-center gap-5 mt-4'>
            <div className='flex1 flex items-center gap-3 border border-gray-100 rounded-md px-3'>

            <LuPaperclip className='text-gray-400' />
            <input
                type="text"
                value={option}
                onChange={({target})=>setOption(target.value)}
                placeholder='Add an attachment'
                className='w-full text-[13px] text-black outline-none bg-white py-2'
            />
            <button
                className='card-btn text-nowrap'
                onClick={handleAddOption}
            >
                <HiMiniPlus className='text-lg' />Add
            </button>
            </div>
            </div>
      
    </div>
  )
}

export default AddAttachmentsInput
