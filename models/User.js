const mongoose=require('mongoose');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');
const crypto=require('crypto')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name']
    },
    email: {
        type: String,
        required:[true,'Please add an email'],
        unique:true,
        match: [
           /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
           'Please add a valid email'
        ]
     },
     role:{
        type: String,
        enum:['user','publisher'],
        default:'user',
     },
     password:{
        type: String,
        required:[true,'Please add a password'],
        minlength:6,
        select:false,
     },
     resetPasswordToken:String,
     resetPasswordExpire:Date,
},{
    timestamps:true,
})

// Encrypt password using bcrypt
userSchema.pre('save',async function(next){
    if(!this.isModified('password'))
    {
        return next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next()
})

// Sign JWT and return 
userSchema.methods.getSignedJwtToken=function(){
return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRE
});
};

// Match user entered password to hashed password in database.
userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken=function(){

    // Generate token :
    const resetToken=crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expire
    this.resetPasswordExpire=Date.now()+10*60*1000;

    return resetToken;
}

const userModel=mongoose.model('User',userSchema);
module.exports=userModel;