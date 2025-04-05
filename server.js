const express=require('express');
const dotenv=require('dotenv')
const morgan=require('morgan')
const colors=require('colors')
const connectDB=require('./config/db')
const notFound=require('./middleware/notFound')
const errorHandler=require('./middleware/error')



//load env vars
dotenv.config({path:'./config/config.env'});

// connect to database
connectDB();

// Route Files
const bootcamps=require('./routes/bootcamps');

const app=express();

// body parser:
app.use(express.json());

// Dev logging middleware
if(process.env.NODE_ENV==='development')
{
    app.use(morgan('dev'))
}




//Mount routers
app.use('/api/v1/bootcamps',bootcamps);

app.use(notFound)
app.use(errorHandler);


const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold);
})

