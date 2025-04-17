const express=require('express');
const router=express.Router();
const {protect}=require('../middleware/auth');
const {register,login,getMe}=require('../controllers/auth')
router.post('/register',register).post('/login',login).get('/me',protect,getMe);

module.exports=router;