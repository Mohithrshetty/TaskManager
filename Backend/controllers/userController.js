const Task= require("../models/Task");
const User= require("../models/User");
const bcrypt= require("bcryptjs");

//@desc get all users(Admin only)
//@route GET/api/users
//@access Private

const getUsers= async (req,res)=>{
    try{

        const users= await User.find({role:"member"}).select("-password"); // Find all users with role "member" and exclude password from the result
    
        //add task count to each user
        const usersWithTaskCount= await Promise.all(users.map(async (user)=>{
            const pendingTask= await Task.countDocuments({
                assignedTo:user._id, // Count tasks assigned to the user
                status:"pending", // Filter tasks with status "pending"

            });
            const inProgressTask= await Task.countDocuments({
                assignedTo:user._id, // Count tasks assigned to the user
                status:"In progress", // Filter tasks with status "in-progress"
            });
            const completedTask= await Task.countDocuments({
                assignedTo:user._id, // Count tasks assigned to the user
                status:"completed", // Filter tasks with status "completed"
            });

            return {
                ...user._doc, // Spread the user document properties
                pendingTask, // Add pending task count
                inProgressTask, // Add in-progress task count
                completedTask, // Add completed task count

          
            };

        }));
        res.json(usersWithTaskCount); // Return the users with task counts as JSON response
    }catch(err){
        res.status(500).json({message:"Server error",error:err.message}); // If an error occurs, return 500 Internal Server Error with error message
    }
}


// @desc Get user by ID
// @route GET /api/users/:id
// @access Private (requires authentication)

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password"); // Find user by ID and exclude password from the result
        if (!user) {
            return res.status(404).json({ message: "User not found" }); // If user not found, return 404 Not Found
        }
        res.json(user); // Return the user as JSON response

    }catch(err) {
        res.status(500).json({ message: "Server error", error: err.message }); // If an error occurs, return 500 Internal Server Error with error message
    }
    }


// @desc Delete user(admin only) by ID
// @route DELETE /api/users/:id
// @access Private (requires authentication)

const deleteUser = async (req, res) => {
    try {
        res.json({ message: `Deleted user with ID: ${req.params.id}` });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message }); // If an error occurs, return 500 Internal Server Error with error message
    }
}

module.exports={
    getUsers,
    getUserById,
    deleteUser,
    // Exporting the functions for use in other files
}