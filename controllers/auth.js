const asyncHandler=require('express-async-handler')
const ErrorResponse=require('../utils/errorResponse')
const User=require('../models/User')


// @desc   Register user
// @route  POST /api/v1/auth/register
// @access Public
const register=asyncHandler(async(req,res,next)=>{
    const {name,email,password,role}=req.body;

    // Create user
    const user=await User.create({
        name,
        email,
        password,
        role,
    })

    sendTokenResponse(user,200,res);
})



// @desc   Login user
// @route  POST /api/v1/auth/login
// @access Public
const login=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;

   // Validate email & password

   if(!email || !password)
   {
    return next(new ErrorResponse('Please provide an email and password',400));
   }

   // Check for user
   const user=await User.findOne({email}).select('+password');

   if(!user)
   {
    return next(new ErrorResponse('Invalid credentials',401));    
   }

   // Check if password matches
   const isMatch=await user.matchPassword(password);

   if(!isMatch)
   {
    return next(new ErrorResponse('Invalid credentials',401));    
   }
    
   sendTokenResponse(user,200,res);
})


// @desc   Get Current logged in user
// @route  Get /api/v1/auth/me
// @access Private

const getMe=asyncHandler(async(req,res,next)=>{
  const user=await User.findById(req.user.id);
  res.status(200).json({
    success:true,
    data:user,

  })
})




// Get token from model, create cookie and send response

const sendTokenResponse=(user,statusCode,res)=>{

    // create token
    const token=user.getSignedJwtToken()

    // Cookie options
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true, // Cookie not accessible via JS
  };

  // For production - secure cookie over HTTPS only
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Send cookie
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
    });
}




module.exports={
    register,
    login,
    getMe,
}
