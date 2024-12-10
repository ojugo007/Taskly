const mongoose = require("mongoose")
require("dotenv").config()

function connectToMongoDB(){
    mongoose.connect(process.env.MONGO_DB_CONNECTION_URL).MONGO_DB_CONNECTION_URL

    mongoose.connection.on("connected", ()=>{
        console.log("connection to mongoDB was successful")
    
    })
    mongoose.connection.on("error", (err)=>{
        console.log("failed to connect to mongoDB", err)
    
    })


}


module.exports = {connectToMongoDB}