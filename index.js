require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
// new token for morgan to log data in POST request
morgan.token('data', (req, res) => JSON.stringify(req.body))
/* NOT IN USE ANYMORE
let persons = [
    {
        name: "Arto Hellas",
        number: "12345",
        id: 1
      },
      {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
      },
      {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
      },
      {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
      }
]

const generateId = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
*/

app.post('/api/persons', (request, response, next) => {
  const body = request.body
// if name or number fields are empty MODIFIED
/*
      if (!body.name || !body.number ) {
        return response.status(400).send({ 
        error: 'The name or number is missing' 
       })
      }
*/
  const person = new Person ({
      name: body.name,
      number: body.number,
  })
   person.save()
   .then(savedPerson =>savedPerson.toJSON())
   .then(savedAndFormattedPerson => {
    response.json(savedAndFormattedPerson)
  }) 
  .catch(error => next(error)) 
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person ={ number: body.number }

  Person.findByIdAndUpdate(request.params.id, person, { runValidators: true, context: 'query', new: true})
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
   res.json(persons.map(person => person.toJSON())) 
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {  
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person.toJSON())
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person.countDocuments({}).then(result =>{
   const date = new Date()
   console.log(result)
   res.send(`<p>Phonebook has info for ${result} people </p> <br>${date}`)
   })
   .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then( result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})  

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error)
  
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
    next(error)
  } 
app.use(errorHandler)
  
  const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})