import { useState,useEffect} from 'react'
import personService from "./services/persons"
import axios from 'axios'


const Notification=({message,error}) => {
  if (message === null){
    return null;
  }
  if (error){
    return(
      <div className="error">
      {message}
    </div>
    )

  }
  return (
    <div className="success">
      {message}
    </div>
  )
}

const Persons = ({persons,filter,deletePerson}) =>{
  return(
      persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person =>
        <p key={person.name}>{person.name} {person.number} 
          <button key={person.name} onClick={() => {
            if (window.confirm(`Delete ${person.name} ?`)){  
              deletePerson(person)}
            }
          }
            >delete
            </button>
          </p>
        )
      )
}

const Filter = ({filter,handleFilterChange}) => {
  return (<div>filter shown with  
     <input id="filter-input" value={filter} onChange={handleFilterChange}></input>
    </div>)
}

const PersonForm =({newName,handleNameChange,newNumber,handleNumberChange,addName}) => {
  return (<form onSubmit={addName}>
        <div>
          name: <input id="name-input" value={newName} onChange={handleNameChange}/>
        </div>
        <div>number: <input id="num-input" value={newNumber} onChange={handleNumberChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>)
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber,setNewNumber]=useState('')
  const [filter,setFilter] = useState('')
  const [successMessage,setSuccessMessage] = useState(null)
  const [errorMessage,setErrorMessage] = useState(null)

  useEffect(()=>{
    axios.get("http://localhost:3001/api/persons")
    .then(response => {
      setPersons(response.data)
    })
  },[])


  const handleNameChange=(event) =>{
  setNewName(event.target.value)
}
const handleNumberChange=(event) =>{
  setNewNumber(event.target.value)
}
const handleFilterChange=(event) => {
  setFilter(event.target.value)
}

const addName = (event) => {
  event.preventDefault();
  let person={
    name: newName,
    number: newNumber
  }
  if (persons.map(person=>person.name).indexOf(newName) !== -1){
    if (window.confirm(`${person.name} is already added to phonebook, 
      replace the old number with a new one?`)){
        let id=persons.find(p=>p.name == newName).id
        personService.update(id,person)
        .then(returnedPerson => {
        setPersons(persons.map(p => p.id !== id ? p : returnedPerson))
        setSuccessMessage(`Modified ${returnedPerson.name}'s number`)
      setTimeout(()=>{
        setSuccessMessage(null)
      },3000)
        setNewName('')
        setNewNumber('')
    })
    .catch(error =>{
      setErrorMessage(`Information of ${person.name} has already been removed from server`)
      setTimeout(() => {
        setErrorMessage(null)
      },3000)

    })
      }
    
    
  }
  else{
    personService.create(person)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setSuccessMessage(`Added ${returnedPerson.name}`)
      setTimeout(()=>{
        setSuccessMessage(null)
      },3000)
      setNewName('')
      setNewNumber('')
    })
  }
  
}


const deletePerson = (person) =>{

  personService.deletePerson(person.id)
  .then(status => {
    setPersons(persons.filter(p => p.id !== person.id))
    setSuccessMessage(`Deleted ${person.name}`)
      setTimeout(()=>{
        setSuccessMessage(null)
      },3000)
  })

}

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} error={true}></Notification>
      <Notification message={successMessage} error={false}></Notification>
      <Filter filter={filter} handleFilterChange={handleFilterChange}></Filter>
      <h2>add a new</h2>
      <PersonForm newName={newName} handleNameChange={handleNameChange}
       newNumber={newNumber} handleNumberChange={handleNumberChange} addName={addName}></PersonForm>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson}></Persons>
      
      
    </div>
  )

}

export default App