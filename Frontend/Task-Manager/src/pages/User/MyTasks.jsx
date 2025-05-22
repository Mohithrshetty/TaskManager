import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { Label } from 'recharts';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';

const MyTasks = () => {
const [allTasks,setAllTasks]=useState([]);
const [tabs,setTabs]=useState([]);
const [filterStatus,setFilterStatus]=useState("all");

const navigate=useNavigate();

const getAllTasks =async() =>{
try{
  const response =await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS,{
    params:{
      status:filterStatus === "all" ? "" : filterStatus,
    },
  });
  setAllTasks(response.data?.tasks?.length >0 ? response.data.tasks: []);

  //map statussummary data with fixed labels and order
  const statusSummary=response.data?.statusSummary ||{};
console.log(response.data.statusSummary)
  const statusArray=[
    {label: "all",count : statusSummary.all ||0},
    {label:"pending", count:statusSummary.pendingTasks ||0},
    {label:"in-progress",count:statusSummary.inProgressTasks|| 0},
    {label:"completed",count:statusSummary.completedTasks || 0},
  ];
  setTabs(statusArray);
}catch(error){
  console.error("error fetching users",error);
}
};

const handleClick =(taskId)=>{
  navigate(`/user/task-details/${taskId}`);
  };



useEffect(()=>{
  getAllTasks(filterStatus);
  return () =>{};
},[filterStatus]);

  return (
   <DashboardLayout activeMenu="My Tasks">
    <div className='my-5'>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        {/* <div className='flex items-center justify-between gap-3'> */}
          <h2 className='text-xl md:text-xl font-medium'>
            My Tasks
          </h2>
          
        {/* </div> */}
        {tabs?.[0]?.count> 0 &&
        (
          // <div className='flex items-center gap-3'>
            <TaskStatusTabs
            tabs={tabs}
            activeTab={filterStatus}
            setActiveTab={setFilterStatus}
            />
           
          /* </div> */
        ) }
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
        {allTasks?.map((item,index) =>(
          <TaskCard
          key={item._id}
          title={item.title}
          description={item.description}
          priority={item.priority}
          status={item.status}
          progress={item.progress}
          createdAt={item.createdAt}
          dueDate={item.dueDate}
          assignedTo={item.assignedTo?.map((user) => user.profileImageUrl)}
          attachmentCount={item.attachments?.length || 0}
          completedTodoCount={item.completedTodoCount || 0}
          todoChecklist ={item.todoChecklist || []}
          onClick ={() =>{
            handleClick(item._id);
          }}
          />
        ))}
      </div>
    </div>
    </DashboardLayout>
  )
}

export default MyTasks
