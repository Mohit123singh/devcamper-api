const express=require('express');
const router=express.Router();

const Bootcamp=require('../models/Bootcamp')
const advancedResults=require('../middleware/advanceResults')

// Include other resource routers
const courseRouter=require('./courses');
const reviewRouter=require('./reviews');

const {protect,authorize,checkExistenceOwnership}=require('../middleware/auth');

// Re-route into other resource routers.
router.use('/:bootcampId/courses',courseRouter);
router.use('/:bootcampId/reviews',reviewRouter);

const { getBootcamps,getBootcamp,createBootcamp, updateBootcamp,deleteBootcamp,getBootcampsInRadius,bootcampPhotoUpload}=require('../controllers/bootcamps')

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/').get(advancedResults(Bootcamp,'courses'),getBootcamps).post(protect,authorize('publisher','admin'),createBootcamp);
router.route('/:id').get(getBootcamp).put(protect,authorize('publisher','admin'),checkExistenceOwnership(Bootcamp),updateBootcamp).delete(protect,authorize('publisher','admin'),checkExistenceOwnership(Bootcamp),deleteBootcamp)
router.route('/:id/photo').put(protect,authorize('publisher','admin'),bootcampPhotoUpload);


module.exports=router;