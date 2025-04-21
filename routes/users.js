const express=require('express');
const router=express.Router();
const advancedResults=require('../middleware/advanceResults')

const {protect,authorize}=require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

const {getUsers,getUser,createUser,updateUser,deleteUser}=require('../controllers/users');

const User=require('../models/User')

router.route('/').get(advancedResults(User),getUsers).post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);
module.exports=router;