const express = require('express')  
const mongoose = require('mongoose') // mongoose is used to handle mongodb 
const dotenv = require('dotenv')  // to secure values it is used
const connectDB = require('./config/db')   // in order to connect with database
const morgan = require('morgan') // it is middleware used to modify request
const exphbs = require('express-handlebars') //it render html pages to client side from server and makes work eas
const passport = require('passport')   // used for user OAuth
const path = require('path')   // To use path module
const app = express()  // iniatilaztion of express framework
const session = require('express-session')  // for storing the user information
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')

// Load config


dotenv.config({ path: './config/config.env' }) //initialization of dot env




connectDB() // //to connect with mongoDB database created in  ./config/db


// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)



// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))        //morgan is a middleware. it gives us information in console whenever we make any request... 
}   

// Handlebars Helpers

// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/hbs')

// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store:MongoStore.create({mongoUrl: process.env.MONGO_URI,}),
  })
)

// Handlebars
app.engine(          // we used here handlebar template engine to render web pages in client side
  '.hbs',            // that means every html page will have .hbs extension
  exphbs.engine({               
    helpers: {
      formatDate, 
      stripTags,
      truncate,
      editIcon,
      select,
    },                       
    defaultLayout: 'main',  // it is default layout
    extname: '.hbs',
  })
)

app.set('view engine', '.hbs') // it is also part of handle bar... it need to create every page in view folder


// Sessions : This the initialization of session
app.use(
  session({
    secret: 'keyboard cat',  // it means data are encrypted
    resave: false,
    saveUninitialized: false,      
    store:MongoStore.create({mongoUrl: process.env.MONGO_URI,}),
  })
)


// Static folder
app.use(express.static(path.join(__dirname, 'public')))  //in order to access static file


// Passport config: Linking with passport js
require('./config/passport')(passport)  


// Passport middleware 
app.use(passport.initialize())
app.use(passport.session())   


// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})


const PORT = process.env.PORT || 3000 // the server will run in the given por of env file or in 3000


// Routes : with this code we are linking our app.js with route files
app.use('/', require('./routes/index'))    
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

app.listen( // this function is called to run the server and port connection
  PORT, 
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)

