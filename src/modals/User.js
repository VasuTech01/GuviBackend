const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        trim: true,
        minlength: 6,
        required: true,
    },
    age: {
        type: Number,
        default: 0,    
    },
    dob: {
        type: String,
        default: "1970-01-01"
    },
    mobile: {
        type: Number,
        trim: true,
        maxlength: 10,
        default: 0
    },
    address: {
        type: String,
        trim: true,
        default:"",
    },
    tokens: [{
        token: {
            type: String,
            trim: true,
        }
    }]
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})
userSchema.statics.findByCredentials = async (email, password) => {
      console.log(email)
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw Error('User Not Found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw Error('Password Not Matching');
        }
        return { msg:true,user};
    } catch (e) {
        console.log(e);
        return {msg:false,error:e.message};
    }
   
}

userSchema.methods.getAuthToken = async function(){
    const user = this;
    console.log("inside getauthtoken");
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}
const User = mongoose.model("User", userSchema);
module.exports=User