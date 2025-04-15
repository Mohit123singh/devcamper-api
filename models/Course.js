const mongoose=require('mongoose');
const courseSchema=new mongoose.Schema({
   

    title:{
       type:String,
       trim:true,
       required:[true,'Please add a course title']
    },
    description:{
        type:String,
        required:[true,'Please add a description']
    },
    weeks:{
        type:String,
        required:[true,'Please add number of weeks']
    },
    tuition:{
        type:Number,
        required:[true,'Please add a tuition cost']
    },

    minimumSkill:{
        type:String,
        required:[true,'Please add a minimum skill'],
        enum:['beginner','intermediate','advanced'],
    },
    scholarshipAvailable:{
        type:Boolean,
        default:false
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true,
    }

   
},{
    timestamps:true,
})

// static method to get avg of course tuitions
courseSchema.statics.getAverageCost=async function(bootcampId){
   // console.log(`Calculating avg cost...`.blue);
    const obj=await this.aggregate([

        { 
            $match: { bootcamp: bootcampId } 
        },

        {
            $group: {
              _id: '$bootcamp',
              averageCost: { $avg: '$tuition' }
            }
        }

    ]);

    //console.log(obj);
    try {
        // Accessing Bootcamp model from inside the Course model
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
          averageCost: Math.ceil(obj[0]?.averageCost || 0),
        });
      } catch (err) {
        console.error(err);
      }
  

}

// Call getAverageCost after save
courseSchema.post('save',async function(){
    this.constructor.getAverageCost(this.bootcamp);
})

// Call getAverageCost after remove
courseSchema.post('remove',async function(){
    this.constructor.getAverageCost(this.bootcamp);
})


const courseModel=mongoose.model('Course',courseSchema);
module.exports=courseModel;