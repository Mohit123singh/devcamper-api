const path=require('path');
const asyncHandler=require('express-async-handler')
const ErrorResponse=require('../utils/errorResponse')
const geocoder=require('../utils/geoCode')
const Bootcamp=require('../models/Bootcamp')

// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
const getBootcamps=asyncHandler(async(req,res,next)=>{

    res.status(200).json(res.advancedResults);
})

// @desc   Get Single bootcamps
// @route  GET /api/v1/bootcamps/:id
// @access Public
const getBootcamp=asyncHandler(async(req,res,next)=>{

    const bootcamp=await Bootcamp.findById(req.params.id);
        
    if(!bootcamp)
    {
       return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`,404));
    }
      

    res.status(200).json({
        success:true,
        data:bootcamp,
    })

})
    


// @desc   Create new bootcamp
// @route  POST /api/v1/bootcamps
// @access Private
const createBootcamp=asyncHandler(async(req,res,next)=>{

    const bootcamp=await Bootcamp.create(req.body);

        res.status(201).json({
            success:true,
            data:bootcamp
        })

    
   
})


// @desc   Update bootcamp
// @route  PUT /api/v1/bootcamps/:id
// @access Private
const updateBootcamp=asyncHandler(async(req,res,next)=>{

    const bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
    })
    if(!bootcamp)
    {
       return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`,404));
    }
      

    res.status(200).json({
        success:true,
        data:bootcamp,
    })
   
})

// @desc   Delete bootcamp
// @route  DELETE /api/v1/bootcamps/:id
// @access Private
const deleteBootcamp=asyncHandler(async(req,res,next)=>{
   

    const bootcamp=await Bootcamp.findById(req.params.id)
    if(!bootcamp)
    {
        return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`,404));
    }
    
    await bootcamp.deleteOne()

    res.status(200).json({
        success:true,
        data:{},
    })
   
});



// @desc   Get bootcamps within a radius
// @route  GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
const getBootcampsInRadius=asyncHandler(async(req,res,next)=>{

    const {zipcode,distance}=req.params;

    // Geocode to get lat/lng
  const results = await geocoder.geocode(`${zipcode}, USA`);
  const loc = results.find(r => r.countryCode === 'us');

  if (!loc) {
    return (next(new ErrorResponse('Valid US location not found for the given ZIP code',404)))
  }

  if (isNaN(distance) || distance <= 0) {
    return next(new ErrorResponse('Please provide a valid distance in miles', 400));
  }
  
  const lat = loc.latitude;
  const lng = loc.longitude;

    // calc radius using radians :
    // Divide dist by radius of Earth :
    // Earth radius : 3,963 mi /6,378 km
    

    const radius=parseFloat(distance)/3963

    
    

    const bootcamps=await Bootcamp.find({
        
        'location.coordinates':{ $geoWithin: { $centerSphere: [ [ lng,lat ], radius ] }}
    })

    res.status(200).json({
        success:true,
        count:bootcamps.length,
        data:bootcamps,
    })
   

   
   
});




// @desc   Upload Photo for bootcamp
// @route  PUT /api/v1/bootcamps/:id/photo
// @access Private
const bootcampPhotoUpload=asyncHandler(async(req,res,next)=>{
   

    const bootcamp=await Bootcamp.findById(req.params.id)
    if(!bootcamp)
    {
        return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`,404));
    }

    if(!req.files)
    {
        return next(new ErrorResponse(`Please upload a file`,400));
    }

 // console.log(req.files)
   const file=req.files.file;

   // Make sure the image is a photo.

   if(!file.mimetype.startsWith('image'))
   {
    return next(new ErrorResponse(`Please upload an image file`,400));
   }

    // check filesize
    if(file.size>process.env.MAX_FILE_UPLOAD)
    {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,400));
    }

    // Create custom filename
    file.name=`photo_${bootcamp._id}${path.parse(file.name).ext}`

    //console.log(file.name);

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async(err)=>{
        if(err){
            console.log(err);
            return next(new ErrorResponse(`Problem with the file upload `,500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name});
    res.status(200).json({
        success: true,
        data: file.name
    })
    })

    
   
   
});


module.exports={
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload,

}