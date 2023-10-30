const { Schema, default: mongoose } = require("mongoose");


const UserSchema = new Schema({
    name:{
        type: String,
        require:true
    },
    email:{
        type: String,
        require:true
    },
    phone:{
        type: Number,
        require:true
    },
    password:{
        type: String,
        require:true
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
})

const User = mongoose.models.User || mongoose.model("User",UserSchema);

export default User;