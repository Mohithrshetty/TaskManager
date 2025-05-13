export const BASE_URL = "http://localhost:8000";

//utils api path.js

export const API_PATHS = {
    AUTH:{
        REGISTER:"/api/auth/register",// Register a new user(Admin or User)
        LOGIN:"/api/auth/login",// Login a user
        GET_PROFILE:"/api/auth/profile",// Get user profile


    },
    USERS:{
        GET_ALL_USERS:"/api/users",// Get all users
        GET_USER_BY_ID:(userId)=>`/api/users/${userId}`,// Get user by id
        CREATE_USER:"/api/users",// Create a new user
        UPDATE_USER:(userId)=>`/api/users/${userId}`,// Update user by id
        DELETE_USER:(userId)=>`/api/users/${userId}`,// Delete user by id

    },
    TASKS:{
        GET_DASHBOARD_DATA:"/api/tasks/dashboard-data",// Get dashboard data
        GET_USER_DASHBOARD_DATA:"/api/tasks/user-dashboard-data",// Get user dashboard data
        GET_ALL_TASKS:"/api/tasks",// Get all tasks
        GET_TASK_BY_ID:(taskId)=>`/api/tasks/${taskId}`,// Get task by id
        CREATE_TASK:"/api/tasks",// Create a new task
        UPDATE_TASK:(taskId)=>`/api/tasks/${taskId}`,// Update task by id
        DELETE_TASK:(taskId)=>`/api/tasks/${taskId}`,// Delete task by id

        UPDATE_TASK_STATUS:(taskId)=>`/api/tasks/${taskId}/status`,// Update task status by id
        UPDATE_TODO_CHECKLIST:(taskId)=>`/api/tasks/${taskId}/todo`,// Update task checklist by id

    },
    REPORTS:{
        EXPORT_TASKS:"/api/reports/export/tasks",// Export tasks
        EXPORT_USERS:"/api/reports/export/users",// Export users
    },
    IMAGE:{
        UPLOAD_IMAGE:"/api/auth/upload-image",// Upload image
        
    }
}
