const asyncHandler=require('express-async-handler')
const ErrorResponse=require('../utils/errorResponse')
const Course=require('../models/Course');
const Bootcamp=require('../models/Bootcamp')

// @desc   Get courses
// @route  GET /api/v1/courses
// @route  GET /api/v1/bootcamps/:bootcampId/courses
// @access Public


const getCourses=asyncHandler(async(req,res,next)=>{

    
    if(req.params.bootcampId)
    {
        const bootcamp = await Bootcamp.findById(req.params.bootcampId);
 
    if (!bootcamp)
      return next(
        new ErrorResponse(`Bootcamp not found with ID of ${req.params.bootcampId}`, 404)
      );
      const courses=await Course.find({bootcamp:req.params.bootcampId})
      return res.status(200).json({
        success:true,
        count:courses.length,
        data:courses,
      })
      
    }
       
    else
    {
        res.status(200).json(res.advancedResults)
    }


    

})


// @desc   Get Single course
// @route  GET /api/v1/courses/:id
// @access Public


const getCourse=asyncHandler(async(req,res,next)=>{

    const course=await Course.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
    })

    if(!course)
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`,404))
   
    res.status(200).json({
        success:true,
        data:course
    })
    

})


// @desc   Add course
// @route  POST /api/v1/bootcamps/:bootcampId/courses
// @access Private


const addCourse=asyncHandler(async(req,res,next)=>{

    req.body.bootcamp=req.params.bootcampId;
     // add user to req.body
     req.body.user=req.user.id;

    const bootcamp=await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp)
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`,404))
   

  // Make sure user is bootcamp owner.
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
        401
      )
    );
  }   
    const course=await Course.create(req.body)

    res.status(200).json({
        success:true,
        data:course
    })
    

})



// @desc   Update course
// @route  PUT /api/v1/courses/:id
// @access Private


const updateCourse=asyncHandler(async(req,res,next)=>{


    const updatedBootcamp = await Course.findByIdAndUpdate(
        req.resource._id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    
      res.status(200).json({
        success: true,
        data: updatedBootcamp,
      });
   
    

})



// @desc   Delete course
// @route  DELETE /api/v1/courses/:id
// @access Private


const deleteCourse=asyncHandler(async(req,res,next)=>{


    await req.resource.deleteOne(); 

    res.status(200).json({
        success:true,
        data:{},
    })
    

})



module.exports={
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse,
}