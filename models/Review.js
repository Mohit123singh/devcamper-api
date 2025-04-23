const mongoose=require('mongoose');
const reviewSchema=new mongoose.Schema({
   

    title:{
       type:String,
       trim:true,
       required:[true,'Please add a title for the review'],
       maxlength:100
    },
    text:{
        type:String,
        required:[true,'Please add some text']
    },
    rating:{
        type:Number,
        min:1,
        max:10,
        required:[true,'Please add a rating between 1 and 10']
    },
    
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true,
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true,
    },
},
   {
    timestamps:true,
})


// Prevent user from submitting more than one review per bootcamp.
// a user acn only leave one review per bootcamp.
reviewSchema.index({bootcamp:1, user:1},{unique:true});


// static method to get avg of rating and save
reviewSchema.statics.getAverageRating=async function(bootcampId){
    // console.log(`Calculating avg cost...`.blue);
     const obj=await this.aggregate([
 
         { 
             $match: { bootcamp: bootcampId } 
         },
 
         {
             $group: {
               _id: '$bootcamp',
               averageRating: { $avg: '$rating' }
             }
         }
 
     ]);
 
     //console.log(obj);
     try {
         // Accessing Bootcamp model from inside the Course model
         await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
           averageRating: obj[0]?.averageRating || 0,
         });
       } catch (err) {
         console.error(err);
       }
   
 
 }
 
 // Call getAverageCost after save
 reviewSchema.post('save',async function(){
     this.constructor.getAverageRating(this.bootcamp);
 })
 
 // Call getAverageCost after remove
 reviewSchema.post('remove',async function(){
     this.constructor.getAverageRating(this.bootcamp);
 })
 

const reviewModel=mongoose.model('Review',reviewSchema);
module.exports=reviewModel;