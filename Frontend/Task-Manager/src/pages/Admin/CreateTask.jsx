import React,{useState} from 'react'
import DashboardLayout from '../../Components/Layouts/DashboardLayout'
import {PRIORITY_DATA} from '../../utils/data'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import { useLocation,useNavigate } from 'react-router-dom'
import moment from 'moment'
import { LuTrash2 } from 'react-icons/lu'
import SelectDropdown from '../../Components/Inputs/SelectDropdown'
import TodoListInput from '../../Components/Inputs/TodoListInput'
import SelectUsers from '../../Components/Inputs/SelectUsers'
import AddAttachmentsInput from '../../Components/Inputs/AddAttachmentsInput'



const CreateTask = () => {

  const location=useLocation();
  const{taskId}=location.state || {};
  const navigate=useNavigate();

  const [taskName,setTaskName]=useState({
    title:"",
    description:"",
    priority:"Low",
    dueDate:null,
    assignedTo:[],
    todoChecklist:[],
    attachments:[],
    

  });

const [currentTask,setCurrentTask]=useState(null);
const [error,setError]=useState(null);
const [loading,setLoading]=useState(false);
const[openDeleteAlert,setOpenDeleteAlert]=useState(false);

const handleValueChange=(key,value)=>{
  setTaskName((prevData)=>({
    ...prevData,
    [key]:value
  }));
}
  const clearData=()=>{
  //reset form data

    setTaskName({
      title:"",
      description:"",
      priority:"Low",
      dueDate:null,
      assignedTo:[],
      todoChecklist:[],
      attachments:[],
    })
  }

  //create Task

  const createTask=async()=>{
    setLoading(true);
    try{
      const todoList=taskName.todoChecklist?.map((item)=>({
        text:item,
        Completed:false
      }))

      const response=await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK,{
        ...taskName,
        todoChecklist:todoList,
        dueDate:new Date(taskName.dueDate).toISOString(),
      });

      toast.success("Task created successfully");
      clearData();

    }catch(error){
      console.log("Error creating task",error);
      setLoading(false);
    }finally{
      setLoading(false);

    }


  };

  //update Tasks
  const updateTask=async()=>{};

  const handleSubmit=async()=>{
    setError(null);
    // input validation
    if(!taskName.title.trim()){
      setError("Please enter task title");
      return;
    }
    if(!taskName.description.trim()){
      setError("Please enter task description");
      return;
    }
    if(!taskName.priority){
      setError("Please select task priority");
      return;
    }
    if(!taskName.dueDate){
      setError(" Due date is required");
      return;
    }
    if(taskName.assignedTo.length===0){
      setError("Please select at least one user");
      return;
    }
    if(taskName.todoChecklist.length===0){
      setError("Please add at least one todo task");
      return;
    }
    if(taskId){
      //update task
       updateTask();
       return;
    }
    createTask();

  };

  //get Task info by ID

  const getTaskDetailsById=async()=>{}

  //delete Task

  const deleteTask=async()=>{};








  return (
    <DashboardLayout activeMenu="Create Task">
    <div className='mt-5'>
      <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
        <div className='form-card col-span-3'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl md:text-xl font-medium'>
              {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                
                  <button className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer'
                   onClick={()=>setOpenDeleteAlert(true)}>
                    <LuTrash2 className='text-base' />Delete
                  </button>
                
              )}
        </div>
        <div className='mt-4'>
          <label className='text-xs font-medium text-slate-600'>
            Task Title
          </label>
            <input
            placeholder='Create App UI'
              type="text"
              value={taskName.title}
              onChange={({target})=>handleValueChange("title",target.value)}
              className='form-input'  

            />
            </div>
            <div className=''>
              <label className='text-xs font-medium text-slate-600'>
                Task Description
              </label>
              <textarea
              placeholder='Describe the task in detail'
                rows={4}
                type="text"
                value={taskName.description}
                onChange={({target})=>handleValueChange("description",target.value)}
                className='form-input'
              />
            </div>

            <div className='grid grid-cols-12 gap-4 mt-2'>
              <div className='col-span-6 md:col-span-4'>
                <label className='text-xs font-medium text-slate-600'>
                  Priority
                </label>
                <SelectDropdown
                options={PRIORITY_DATA}
                value={taskName.priority}
                onChange={(value)=>handleValueChange("priority",value)}
                placeholder="Select Priority"

                />
              </div>
              <div className='col-span-6 md:col-span-4'>
                <label className='text-xs font-medium text-slate-600'>
                  Due Date
                </label>
                <input
                type="date"
                value={taskName.dueDate}
                onChange={({target})=>handleValueChange("dueDate",target.value)}
                className='form-input'
                />
                </div>
               
              <div className='col-span-12 md:col-span-3'>
                <label className='text-xs font-medium text-slate-600'>
                  Assigned To
                </label>
                <SelectUsers
                selectedUsers={taskName.assignedTo}
                setSelectedUsers={(value)=> {
                  handleValueChange("assignedTo",value);
                }}
                />
                </div>
               
              </div>

              <div className='mt-3'>
                <label className='text-xs font-medium text-slate-600'>
                  Todo Checklist
                </label>
                <TodoListInput
                todoList={taskName?.todoChecklist}
                setTodoList={(value)=>handleValueChange("todoChecklist",value)}
                />
                </div>

<div className='mt-3'>
  <label className='text-xs font-medium text-slate-600'>
    Attachments
  </label>

  <AddAttachmentsInput
  attachments={taskName?.attachments}
  setAttachments={(value)=>handleValueChange("attachments",value)}
  />
  </div>

  {error && (
    <p className='text-xs text-red-500 font-medium mt-5'>
      {error} 
    </p>
  )}
  <div className='flex justify-end  mt-7'>
    <button
    className='add-btn'
    onClick={handleSubmit}
    disabled={loading}  
    >
          {taskId ? "Update Task" : "Create Task"}    
    </button>
    </div>
      </div>
    </div>
    </div>
    </DashboardLayout>
  )
}


export default CreateTask;
