const mongoose = require('mongoose')

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url =
  `mongodb+srv://FullStack:${password}@cluster0-uk9yg.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

if ( process.argv.length===3 ) { 
    Person.find({})
    .then(result => {
        console.log("phonebook:")
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })  
}

if ( process.argv.length===5 ) {
    const person = new Person({
        name: personName,
        number: personNumber,
      })
      person.save().then(response => {
        console.log(`added ${response.name} number ${response.number} to phonebook`)
        mongoose.connection.close()
      })  
} 


