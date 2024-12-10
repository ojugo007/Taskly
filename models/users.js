const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")


const schema = mongoose.Schema

const UserSchema = new schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true 
    }

});

UserSchema.plugin(passportLocalMongoose)


const User = mongoose.model("users", UserSchema)

module.exports = User;