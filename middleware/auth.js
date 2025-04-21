const jwt=require('jsonwebtoken');
const asyncHandler=require('express-async-handler')
const ErrorResponse=require('../utils/errorResponse')
const User=require('../models/User')

// Protect Routes

const protect=asyncHandler(async(req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        token=req.headers.authorization.split(' ')[1];
    }

    // else if(req.cookies.token)
    // {
    //     token=req.cookiew.token;
    // }

    // Make sure token exists
    if(!token)
    {
        return next(new ErrorResponse('Not authorize to access this route',401));
    }

    try{
        //verify token
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        req.user=await User.findById(decoded.id);
        next();


    }catch(err)
    {
        return next(new ErrorResponse('Not authorize to access this route',401));
    }

    

})

// Grant access to specific roles

const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`,403));
    }
   
    return next();
};


// @desc Middleware to check existence and ownership of a resource
const checkExistenceOwnership = model =>
  asyncHandler(async (req, res, next) => {
    const resource = await model.findById(req.params.id);

    if (!resource) {
      return next(
        new ErrorResponse(`Resource not found with id: ${req.params.id}`, 404)
      );
    }

    // Check ownership unless user is admin
    if (req.user.role !== 'admin' && resource.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to access this resource`,
          401
        )
      );
    }

    // Attach the resource to request for later use
    req.resource = resource;

    next();
  });


module.exports={
    protect,
    authorize,
    checkExistenceOwnership,
}