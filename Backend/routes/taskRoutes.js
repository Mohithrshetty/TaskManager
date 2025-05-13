const express= require("express");
const {protect,adminOnly}=require("../middlewares/authMiddleware");
const { getDashboardData, getUserDashboardData, getTasks, getTaskByID, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist } = require("../controllers/taskController");

const router=express.Router();

//task management routes
router.get("/dashboard-data",protect,getDashboardData);
router.get("/user-dashboard-data",protect,getUserDashboardData);
router.get("/",protect,getTasks);//get all tasks (admin:all,userL:assigned)
router.get("/:id",protect,getTaskByID); //get task by id
router.post("/",protect,adminOnly,createTask); //create task(admin)
router.put("/:id",protect,updateTask);
router.delete("/:id",protect,adminOnly,deleteTask);//delete task(admin only)
router.put("/:id/status",protect,updateTaskStatus);
router.put("/:id/todo",protect,updateTaskChecklist);

module.exports=router;