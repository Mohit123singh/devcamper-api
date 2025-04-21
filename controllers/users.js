const asyncHandler=require('express-async-handler')
const ErrorResponse=require('../utils/errorResponse')
const User=require('../models/User')


// @desc   Get all users
// @route  Get /api/v1/auth/users
// @access Private/admin

const getUsers=asyncHandler(async(req,res,next)=>{
   res.status(200).json(res.advancedResults);
})


// @desc   Get single user
// @route  Get /api/v1/auth/users/:id
// @access Private/admin

const getUser=asyncHandler(async(req,res,next)=>{
    const user=await User.findById(req.params.id)

    res.status(200).json({
        success:true,
        data:user,
    });
 })



// @desc   Create User
// @route  POST /api/v1/auth/users
// @access Private/admin

const createUser=asyncHandler(async(req,res,next)=>{

    const user=await User.create(req.body)

    res.status(201).json({
        success:true,
        data:user,
    });
 })



// @desc   Update User
// @route  PUT /api/v1/auth/users/:id
// @access Private/admin

const updateUser=asyncHandler(async(req,res,next)=>{

    const user=await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,

    })

    res.status(200).json({
        success:true,
        data:user,
    });
 })


// @desc   Delete User
// @route  Delete /api/v1/auth/users/:id
// @access Private/admin

const deleteUser=asyncHandler(async(req,res,next)=>{

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success:true,
        data:{}
    });
 })

 module.exports={
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
 }