const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
// new token for morgan to log data in POST request
morgan.token('data', (req, res) => JSON.stringify(req.body))

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
  
app.post('/api/persons', (request, response) => {
    
  const body = request.body
      if (!body.name || !body.number ) {
      return response.status(400).json({ 
        error: 'The name or number is missing' 
      })
    }

  found = persons.find(person => person.name === body.name)
     if (found) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }

  const person = {
      name: body.name,
      number: body.number,
      id: generateId(0,10000),
    }
  
    persons = persons.concat(person)
    response.json(person)
  })

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

app.get('/info', (req, res) => {
   const entries = persons.length 
   const date = new Date()
   console.log(entries)
   res.send(`<p>Phonebook has info for ${entries} people </p> <br>${date}`)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })  

  const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})