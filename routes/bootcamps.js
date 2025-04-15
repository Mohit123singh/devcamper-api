const express=require('express');
const router=express.Router();

const Bootcamp=require('../models/Bootcamp')
const advancedResults=require('../middleware/advanceResults')

// Include other resource routers
const courseRouter=require('./courses');


// Re-route into other resource routers.
router.use('/:bootcampId/courses',courseRouter);

const { getBootcamps,getBootcamp,createBootcamp, updateBootcamp,deleteBootcamp,getBootcampsInRadius,bootcampPhotoUpload}=require('../controllers/bootcamps')

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/').get(advancedResults(Bootcamp,'courses'),getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)
router.route('/:id/photo').put(bootcampPhotoUpload);


module.exports=router;