const express=require('express');
const router=express.Router();
const {protect}=require('../middleware/auth');
const {register,login,getMe,forgotPassword,resetPassword,updateDetails,updatePassword}=require('../controllers/auth')
router.post('/register',register).post('/login',login).get('/me',protect,getMe).post('/forgotPassword',forgotPassword).put('/resetpassword/:resettoken',resetPassword).put('/updateDetails',protect,updateDetails).put('/updatepassword',protect,updatePassword);

module.exports=router;