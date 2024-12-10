const express = require("express")
const Task = require("../models/tasks")

const taskRoute = express.Router()




taskRoute.post("/", async(req, res)=>{
   
    const {description} = req.body

    const newTask = new Task({
        userId : req.user._id,
        description
    })

    await newTask.save()
    res.status(201).redirect("/task")  
        
})

taskRoute.get("/", async(req, res)=>{
    try{
      const tasks = await Task.find({userId:req.user._id })
        //   RENDER TASKLIST
      res.render("tasklist", {user : req.user, tasks})

    }catch(err){
        console.log(err)
        res.status(400).send({message:"unable to get task"})
    }

})

// gets the task  to be updated by id renders the page for edit of task and pass the task to populate the input field
taskRoute.get("/:taskId/edit", async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);

        if (!task || task.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Task not found or you do not have permission to edit it." });
        }

        res.render("editTask", { task });  // Render the edit page with the task data
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Unable to fetch task", err });
    }
});

// updates the task by id
taskRoute.post("/:taskId/update", async(req, res)=>{
    try {

        const { description, state } = req.body;
        
        const taskId = req.params.taskId;

        const task = await Task.findById(taskId);

        if (!task || task.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Task not found or you do not have permission to edit it." });
        }

        task.description = description;
        task.state = state;
        task.updated_at = Date.now();
        await task.save()

        res.redirect("/task")

    } catch (error) {
        console.log(err)
        res.status("500").json({message:"unable to update task", error : error.message || error})
    }

})

taskRoute.get("/:taskId/confirm-delete", async(req, res)=>{
    try{
        const task = await Task.findById(req.params.taskId)

        if (!task || task.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Task not found or you do not have permission to delete." });
        }
        res.render("deleteTask", {task})
    
    }catch(error){
        console.log(error)
        res.status(500).json({message: "unable to fetch task", error:error.message || error })
    
    }
})



taskRoute.post("/:taskId/delete", async (req, res)=>{
    console.log("Delete route hit for task:", req.params.taskId); 
    try{
        const task = await Task.findById(req.params.taskId)

        if (!task || task.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Task not found or you do not have permission to delete." });
        }
        console.log(task)
        await Task.findByIdAndDelete(req.params.taskId)
           
        res.status(200).redirect("/task")
 
    }catch(error){
        console.log(error)
        res.status(500).json({message: "unable to delete task", error: error.message || error})
    }

})

// taskRoute.delete("/:taskId/delete", async (req, res) => {
//     console.log("Delete route hit for task:", req.params.taskId); // Debugging
//     try {
//         const task = await Task.findById(req.params.taskId);

//         if (!task) {
//             return res.status(404).json({ message: "Task not found" });
//         }

//         // Ensure the user owns the task (optional, depending on your app's logic)
//         if (task.userId.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: "Not authorized to delete this task" });
//         }

//         await task.remove(); // Delete the task
//         res.redirect("/task"); // Redirect to task list page after deletion
//     } catch (error) {
//         console.error("Error deleting task:", error);
//         res.status(500).json({ message: "Unable to delete task", error: error.message || error });
//     }
// });

module.exports = taskRoute