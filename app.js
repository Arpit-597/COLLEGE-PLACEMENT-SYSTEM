const express = require('express') 
// console.log(express)
const app = express()
// console.log(app)

const web = require('./routes/web')

const connectDb = require('./database/dbcon')

const flash = require("connect-flash")
const session = require("express-session")

require("dotenv").config()

const setUserInfo = require("./middlewares/setUserInfo")


// Messages
app.use(session({
    secret:'secret',
    cookie:{maxAge:60000},
    resave:false,
    saveUninitialized:false,
}));
// Flash messages
app.use(flash())

const cookieParser = require("cookie-parser")
// token get cookies
app.use(cookieParser())

app.use(setUserInfo)

//Database connect
connectDb()

// view ejs
app.set('view engine', 'ejs')

// images css js etc
app.use(express.static('public'))


app.use(express.urlencoded())



const fileUpload = require("express-fileupload")
// image upload form se controller ke paas jaati hai
app.use(fileUpload({
    useTempFiles : true,
    // tempFileDir : '/tmp/'
}));




//route load
app.use('/',web)
// This means it will direct to web variable , then as above web require the web.js file exports in which we get the "get function"

//server start
app.listen(process.env.PORT,()=>{
    console.log(`server start localhost:${process.env.PORT}`)
})
