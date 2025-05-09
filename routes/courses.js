const express=require('express');
const router=express.Router({mergeParams:true});
const Course=require('../models/Course')
const advancedResults=require('../middleware/advanceResults')

const {protect,authorize,checkExistenceOwnership}=require('../middleware/auth');


const {getCourses,getCourse,addCourse,updateCourse,deleteCourse}=require('../controllers/courses');

router.route('/').get(advancedResults(Course,{
    path:'bootcamp',
    select:'name description'
}),getCourses).post(protect,authorize('publisher','admin'),addCourse)
router.route('/:id').get(getCourse).put(protect,authorize('publisher','admin'),checkExistenceOwnership(Course),updateCourse).delete(protect,authorize('publisher','admin'),checkExistenceOwnership(Course),deleteCourse);

module.exports=router;