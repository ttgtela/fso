const express=require('express')
const morgan=require('morgan')
const cors = require('cors')
const app=express()

app.use(express.json())
app.use(cors())

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan((tokens, req, res) => {
    const tinyLog = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
    const bodyLog = tokens.body(req, res);
    return bodyLog ? `${tinyLog} | body: ${bodyLog}` : tinyLog;
  })
);

let persons=[
    {
        "id":"1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": "2"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": "4"
    }
  ]


const count=persons.length

app.get("/info",(request,response) => {
    const date=new Date()
    response.send(`<div><h3>Phonebook has info for ${count} people</h3>
        <h3>${date}</h3></div>`)

})

app.get("/api/persons/:id", (request,response) => {
    const id=request.params.id
    person=persons.find(p => p.id===id)
    if (person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request,response) => {
    const id=request.params.id
    person=persons.find(p=>p.id===id)
    console.log("deleted person ",person)
    persons=persons.filter(p => p.id !== id)

    response.status(204).end()
    
})

app.post("/api/persons", (request,response) => {
    const minCeiled = Math.ceil(1)
    const maxFloored = Math.floor(100)
    const id= Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled).toString()
    const person=request.body
    if (!person.name){
        response.status(400).json({error: "name missing"})
    }
    if (!person.number){
        response.status(400).json({error: "number missing"})
    }
    existingPerson=persons.find(p=>p.name===person.name)
    if (existingPerson){
        response.status(400).json({error: "Person with the same name already exists"})
    }
    console.log("Added ",person)
    person.id=id
    persons=persons.concat(person)
    response.json(person)
    
})

app.get("/api/persons",(request,response) => {
    response.json(persons)
})


const PORT=process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

