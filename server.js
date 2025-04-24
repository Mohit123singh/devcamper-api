const path=require('path');
const express=require('express');
const dotenv=require('dotenv')
const morgan=require('morgan')
const colors=require('colors')
const cookieParser=require('cookie-parser')
const mongoSanitize=require('express-mongo-sanitize')
const helmet=require('helmet')
const xss=require('xss-clean')
const rateLimit=require('express-rate-limit')
const hpp=require('hpp');
const cors=require('cors');

const fileUpload=require('express-fileupload')
const connectDB=require('./config/db')
const notFound=require('./middleware/notFound')
const errorHandler=require('./middleware/error')



//load env vars
dotenv.config({path:'./config/config.env'});

// connect to database
connectDB();

// Route Files
const bootcamps=require('./routes/bootcamps');
const courses=require('./routes/courses');
const auth=require('./routes/auth')
const users=require('./routes/users')
const reviews=require('./routes/reviews');

const app=express();

// body parser:
app.use(express.json());
app.use(express.urlencoded({extended:false}))

// Cookie parser
app.use(cookieParser())

// Dev logging middleware
if(process.env.NODE_ENV==='development')
{
    app.use(morgan('dev'))
}

// File uploading :
app.use(fileUpload());

// Sanitize data
app.use(mongoSanitize());

// set security headers
app.use(helmet({ contentSecurityPolicy: false }));

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
app.use(limiter);

// Prevent http param pollution
app.use(hpp())

//Enable CORS

app.use(cors())

// Set static folder 
app.use(express.static(path.join(__dirname,'public')));


//Mount routers
app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth',auth)
app.use('/api/v1/users',users)
app.use('/api/v1/reviews',reviews)


app.use(notFound)
app.use(errorHandler);


const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold);
})

