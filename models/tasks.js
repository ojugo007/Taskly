const mongoose = require("mongoose")

const schema = mongoose.Schema

const TaskSchema = new schema({
    description:{
        type: String,
        required: true
    },
    state:{
        type:String,
        enum: ["pending", "completed", "deleted"],
        default:"pending"
    },
    created_at:{
        type: Date,
        default: Date.now
    },
    updated_at:{
        type: Date,
        default: Date.now
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

})

const Task = mongoose.model("tasks", TaskSchema)

module.exports = Task