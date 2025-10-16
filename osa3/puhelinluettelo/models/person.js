const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
const url = process.env.MONGODB_URI

mongoose.connect(url).then(() => {
  console.log('Connected to MongoDB')
})
  .catch((error) => {
    console.log('error connecting to MongoDB: ',error.message)
  })

const personSchema=new mongoose.Schema({
  name: {
    type: String,
    minlength: 3
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: (v) => {
        return /^(?:\d{2}-\d{6,}|\d{3}-\d{5,})$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id=returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person',personSchema)



