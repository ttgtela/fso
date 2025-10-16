require('dotenv').config()
const express=require('express')
const Person=require('./models/person')
const morgan=require('morgan')
const cors = require('cors')
const app=express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(
  morgan((tokens, req, res) => {
    const tinyLog = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ].join(' ')
    const bodyLog = tokens.body(req, res)
    return bodyLog ? `${tinyLog} | body: ${bodyLog}` : tinyLog
  })
)

app.get('/api/persons/:id', (request,response,next) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request,response,next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))

})

app.post('/api/persons', (request,response,next) => {
  const body=request.body
  if (!body.name){
    response.status(400).json({ error: 'name missing' })
  }
  if (!body.number){
    response.status(400).json({ error: 'number missing' })
  }
  const person=new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    console.log('Added ',savedPerson)
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.get('/api/persons',(request,response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.put('/api/persons/:id',(request,response,next) => {
  const { name,number } =request.body
  Person.findById(request.params.id)
    .then(person => {
      if (!person){
        return response.status(404).end()
      }
      person.name=name
      person.number=number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    }
    ).catch(error => next(error))
})

app.get('/info',async (request,response) => {
  const count=await Person.countDocuments({})
  const date=new Date()
  response.send(`<div><h3>Phonebook has info for ${count} people</h3>
  <h3>${date}</h3></div>`)
})


const unknownEndpoint = (request,response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError'){
    return response.status(400).send({ error : 'malformatted id' })
  }
  else if (error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)


const PORT=process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

