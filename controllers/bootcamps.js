const asyncHandler=require('express-async-handler')
const ErrorResponse=require('../utils/errorResponse')
const geocoder=require('../utils/geoCode')
const Bootcamp=require('../models/Bootcamp')

// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
const getBootcamps=asyncHandler(async(req,res,next)=>{

    let query;

    //Copy req.query
    const reqQuery={...req.query};

    // Fields to exclude
    const removeFields=['select','sort','page','limit']

    // Loop over removeFields and delete them from reqQuery.
    removeFields.forEach(param=> delete reqQuery[param]);

    console.log(reqQuery);

    //Create  query string
    let queryStr=JSON.stringify(reqQuery);

    // Create operators ($gt,$gte,etc)

    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
      );

   // console.log(queryStr)
    
   // Finding resource
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    //Select Fields :
    if(req.query.select)
    {
        const fields=req.query.select.split(',').join(' ');
        query=query.select(fields);
       
    }

    //sort

    if(req.query.sort)
    {
        const sortBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    }
    else
    {
        query=query.sort('-createdAt');
    }

    // Pagination :
    const page=parseInt(req.query.page,10) || 1;
    const limit=parseInt(req.query.limit,10) || 25;
    const startIndex=(page-1)*limit;
    const endIndex=page*limit;
    //  total number of documents matching the filters,
    const total=await Bootcamp.countDocuments(JSON.parse(queryStr))

    query=query.skip(startIndex).limit(limit)
    

    //Executing query
    const bootcamps=await query

    // Pagination result :

    const pagination={};

    if(endIndex<total)
    {
        pagination.next={
            page:page+1,
            limit
        }
    }
    if(startIndex>0)
    {
        pagination.prev={
            page:page-1,
            limit
        }
    }
   

    res.status(200).json({
        success:true,
        count:bootcamps.length,
        pagination,
        data:bootcamps,
    })
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


module.exports={
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,

}