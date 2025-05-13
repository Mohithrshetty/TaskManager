const Task=require("../models/Task");

//@desc get all tasks (admin:all,user:only assigned task)
//@route GET/api/tasks/
//@access private
const getTasks=async(req,res)=>{
    try{
        const {status}=req.query; 
        let filter ={};
        if(status){
            filter.status=status;
        }

        let tasks;

        if(req.user.role==="admin"){
            tasks=await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }else {
            tasks=await Task.find({...filter,assignedTo:req.user._id}).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }


        //add complete todochecklist count to each task
        tasks =await Promise.all(
            tasks.map(async(task)=>{
                const completedCount=task.todoChecklist.filter(
                    (item)=>item.completed
                ).length;
                return {...task._doc,completedTodoCount:completedCount};
    })
);

//status summary counts
const allTasks=await Task.countDocuments(
    req.user.role==="admin"?{}:{assignedTo:req.user._id}
);

const pendingTasks=await Task.countDocuments({
    ...filter,
    status:"pending",
    ...(req.user.role !=="admin" && {assignedTo:req.user._id}),
}); 

const inProgressTasks=await Task.countDocuments({
    ...filter,
    status:"In Progress",
    ...(req.user.role !=="admin"&& {assignedTo:req.user._id}),
});

const completedTasks=await Task.countDocuments({
    ...filter,
    status:"Completed",
    ...(req.user.role !=="admin"&& {assignedTo:req.user._id}),
}); 

res.json({
    tasks,
    statusSummary:{
        all:allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
    },
});
}
    catch(error){
        res.status(500).json({message:"server error",error:error.message});
    }
};

//@desc get task by ID
//@route GET/api/tasks/:id
//@access private
const getTaskByID=async(req,res)=>{
    try{
        const task=await Task.findById(req.params.id).populate(
            "assignedTo",
        "name email profileImageUrl"
        );

        if (!task) return res.status(400).json({message:"Task not found"});
        
        res.json(task)
    }catch(error){
        res.status(500).json({message:"server error",error:error.message});
    }
};

//@desc create a new task(admin only)
//@route POST/api/tasks/
//@access private(admin)
const createTask=async(req,res)=>{
    try{
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
        }=req.body;
        if(!Array.isArray(assignedTo)){
            return res
            .status(400)
            .json({message:"assignedTo must be an array of user IOs"});
        }
        const task=await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy:req.user._id,
            todoChecklist,
            attachments,
        });
        res.status(201).json({message:"task created successfully",task}); 

    }catch(error){
        res.status(500).json({message:"server error",error:error.message});
    }
};

//@desc update task details
//@route PUT/api/tasks/:id
//@access private
const updateTask=async(req,res)=>{
    try{
        const task=await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message:"task not found"});

        task.title=req.body.title||task.title;
        task.description=req.body.description||task.description;
        task.priority=req.body.priority||task.priority;
        task.dueDate=req.body.dueDate||task.dueDate;
        task.todoChecklist=req.body.todoChecklist||task.todoChecklist;
        task.attachments=req.body.attachments||task.attachments;

        if (req.body.assignedTo){
            if(!Array.isArray(req.body.assignedTo)){
                return res.status(400).json({message:"assignedTo must be an array of IDs"});
            }
            task.assignedTo=req.body.assignedTo;
        }

    const updatedTask=await task.save();
    res.json({message:"task updated successfully",updatedTask});
    }catch(error){
        res.status(500).json({message:"server error",error:error.message});
    }
};

//@desc Delete a task(Admin only)
//@route DELETE/api/tasks/:id
//@access private(admin)
const deleteTask=async(req,res)=>{
    try{
        const task=await Task.findById(req.params.id);

        if(!task) return res.status(404).json({message:"task not found"});
        
        await task.deleteOne();
        res.json({message:"task deleted successfully"});
    }catch(error){
        res.status(500).json({message:"server error",error:error.message});
    }
};

//@desc update task status
//@route PUT/api/tasks/status
//@access private
const updateTaskStatus=async(req,res)=>{
    try{
        const task=await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message:"task not found"});

        const isAssigned =task.assignedTo.some(
            (userId)=>userId.toString()===req.user._id.toString()
        );

        if(!isAssigned && req.user.role !=="admin"){
            return res.status(403).json({message:"Not authorized"});
        }
        task.status=req.body.status||task.status;

        if(task.status==="completed"){
            task.todoChecklist.forEach((item)=>(item.completed=true));
            task.progress=100;
        }

        await task.save();
        res.json({message:"Task status updated",task});
    }catch(error){
        res.status(500).json({message:"server error",error:error.message});
    }
};

//@des update task checklist
//@route PUT/api/tasks/:id
//@access private
const updateTaskChecklist=async(req,res)=>{
    try{
        const {todoChecklist}=req.body;
        const task=await Task.findById(req.params.id);

        if(!task) return res.status(404).json({message:"task not found"});

        if(!task.assignedTo.includes(req.user._id)&& req.user.role !=="admin"){
            return res.status(403).json({message:"not authorized to update checklist"});
        }

        task.todoChecklist= todoChecklist; //replace with updated checklist
        //auto-update progress based on checklist completion
        const completedCount=task.todoChecklist.filter(
            (item)=>item.completed
        ).length;
        const totalItems=task.todoChecklist.length;
        task.progress=
        totalItems > 0 ? Math.round((completedCount/totalItems)*100) : 0;

    //auto mark task as completed if all items are checked  
    if(task.progress===100) {
        task.status="completed";
    }
    else if(task.progress > 0){
        task.status="in-progress";
    }     
    else{
        task.status="pending";
    }

    await task.save();
    const updatedTask= await Task.findById(req.params.id).populate(
        "assignedTo",
        "name email profileImageUrl"
    );

    res.json({message:"Task checklist updated",task:updatedTask});
    }catch(error){
        res.status(500).json({message:"server error",error:error.message});
    }
};

//@desc dashboard data(admin only)
//@route GEt/api/tasks/dashboard-data
//@access private
const getDashboardData=async(req,res)=>{
    try{
        //fetch statistics
        const totalTasks=await Task.countDocuments();
        const pendingTasks=await Task.countDocuments({status:"pending"});
        const completedTasks=await Task.countDocuments({status:"completed"});
        const overdueTasks=await Task.countDocuments({
            status:{$ne:"completed"},
            dueDate:{$lt:new Date()},
        });

        //ensure all possible statuses are included
        const taskStatuses=["pending","in-progress","completed"];
        const taskDistributionRaw=await Task.aggregate([
            {
                $group:{
                    _id:"$status",
                    count:{$sum:1}
                },
            },
        ]);
        const taskDistribution=taskStatuses.reduce((acc,status)=>{
            const formattedKey=status.replace(/\s+/g,""); //remove spaces for response keys
            acc[formattedKey]=
            taskDistributionRaw.find((item)=>item._id==status)?.count|| 0;
            return acc;
        },{});
        taskDistribution["All"]=totalTasks;//add total count to taskDistribution

        //ensure all priority levels are included
        const taskPriorities=["low","medium","high"];
        const taskPriorityLevelsRaw=await Task.aggregate([
            {
                $group:{
                    _id:"$priority",
                    count:{$sum:1},
                },
            },
        ]);
        const taskPriorityLevels=taskPriorities.reduce((acc,priority)=>{
            acc[priority]=taskPriorityLevelsRaw.find((item)=>item._id === priority)?.count || 0;
            return acc;
        },{});

        //fetch recent 10 tasks
        const recentTasks=await Task.find()
        .sort({createdAt: -1})
        .limit(10)
        .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics:{
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts:{
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    }catch(error){
        res.status(500).json({message:"server error",error:error.message});
    }
};

//@desc dashboard data(user-specific)
//@route GET/api/tasks/user-dashboard-data
//@access private
const getUserDashboardData=async(req,res)=>{
    try{
        const userId=req.user._id;//only fetch data for the loggedin user

        //fetch statustucs for user-specific tasks
        const totalTasks=await Task.countDocuments({assignedTo: userId});
        const pendingTasks=await Task.countDocuments({assignedTo: userId,status:"pending"});
        const completedTasks=await Task.countDocuments({assignedTo: userId,status:"completed"});
        const overdueTasks=await Task.countDocuments({assignedTo: userId,
            status:{$ne:"completed"},
            dueDate:{$lt:new Date()},
        });

        //Task distribution by status
        const taskStatuses=["pending","in-progress","completed"];
        const taskDistributionRaw=await Task.aggregate([
          { $match:{assignedTo: userId } },
          { $group:{_id:"$status",count: { $sum:1 } } },   
        ]);

        const taskDistribution=taskStatuses.reduce((acc,status)=>{
            const formattedKey=status.replace(/\s+/g,"");
            acc[formattedKey]=
            taskDistributionRaw.find((item)=>item._id ===status)?.count || 0;
            return acc;
        },{});
        taskDistribution["All"]=totalTasks;

        //task distribution by priority
        const taskPriorities=["low","medium","high"];
        const taskPriorityLevelsRaw=await Task.aggregate([
            {$match :{assignedTo: userId } },
            {$group: {_id:"$priority",count: {$sum: 1} } },
        ]);

        const taskPriorityLevels=taskPriorities.reduce((acc,priority)=>{
            acc[priority]=
            taskPriorityLevelsRaw.find((item)=>item._id=== priority)?.count || 0;
            return acc;
        },{});
        
        //fetch recent 10 tasks for the logged-in user
        const recentTasks=await Task.find({assignedTo: userId})
        .sort({createdAt:-1})
        .limit(10)
        .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics:{
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts:{
               taskDistribution,
               taskPriorityLevels,
            },
            recentTasks,
        });
    }catch(error){
        res.status(500).json({message:"server error",error:error.message});
    }
}; 

module.exports={
    getTasks,
    getTaskByID,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData,
};