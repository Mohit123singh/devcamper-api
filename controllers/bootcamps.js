// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
const getBootcamps=(req,res,next)=>{
    res.status(200).json({success:true,msg:'Show all bootcamps'})
}

// @desc   Get Single bootcamps
// @route  GET /api/v1/bootcamps/:id
// @access Public
const getBootcamp=(req,res,next)=>{
    res.status(200).json({success:true,msg:`Show bootcamp ${req.params.id}`})
}


// @desc   Create new bootcamp
// @route  POST /api/v1/bootcamps
// @access Private
const createBootcamp=(req,res,next)=>{
    res.status(200).json({success:true,msg:'Create new bootcamp'})
}


// @desc   Update bootcamp
// @route  PUT /api/v1/bootcamps/:id
// @access Private
const updateBootcamp=(req,res,next)=>{
    res.status(200).json({success:true,msg:`Update bootcamp ${req.params.id}`})
}

// @desc   Delete bootcamp
// @route  DELETE /api/v1/bootcamps/:id
// @access Private
const deleteBootcamp=(req,res,next)=>{
    res.status(200).json({success:true,msg:`Delete bootcamp ${req.params.id}`})
}


module.exports={
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp

}