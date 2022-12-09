
// It was made for connecting with database

const mongoose = require('mongoose')   //it is needed to handle mongoDB database
const connectDB = async () => {    //IN order to connect with database asynchronously
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true, // <-- no longer necessary
        useUnifiedTopology: true // <-- no longer necessary
    })

    console.log(`MongoDB Connected`)  //msg for successful connection
  } catch (err) {                   //if there any error
    console.error(err) 
    process.exit(1)
  }
}

module.exports = connectDB