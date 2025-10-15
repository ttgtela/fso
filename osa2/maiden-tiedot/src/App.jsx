import { useState,useEffect } from 'react'
import CountryService from "./services/countries"


const OneCountryView=({country}) => {
  let languages=Object.values(country.languages)
  let flag=country.flags.png
    return(
  <div>
    <h1>{country.name.common}</h1>
    <p>Capital {country.capital}</p>
    <p>Area {country.area}</p>
    <h1>Languages</h1>
    <ul>
      {languages.map((l,index)=>
      (<li key={index}>{l}</li>))}
    </ul>
    <img src={flag}></img>

  </div>
  )

}

const SearchResult=({countries,searchStr,onShowCountry})=>{
  if (searchStr == ''){
    return(<div></div>)
  }
  const filteredCountries=countries.filter(c=>c.name.common.toLowerCase().includes(searchStr.toLowerCase()))
  if (filteredCountries.length === 1){
    let country=filteredCountries[0]
    return(<OneCountryView country={country}></OneCountryView>)
  }

  
  
  if (filteredCountries.length>10){
    return(
      <div>Too many matches, specify another filter</div>
    )
  }
  if (filteredCountries.length <= 10 && filteredCountries.length>1){
    return(
    <div>
    {filteredCountries.map(c=>
      <p key={c.name.common}>{c.name.common} <button onClick={() => onShowCountry(c)}>Show</button></p>
    )}
  </div>
  )

  }
  return(<div></div>)
}

const App= ()=> {
  const [countries, setCountries] = useState([])
  const [searchStr,setSearchStr] = useState('')
  const [selectedCountry,setSelectedCountry]=useState(null)
  useEffect(() => {
    CountryService.getAll().then(countryData=>{
      setCountries(countryData)
    })
  },[])

  const handleSearchStrChange=(event)=>{
    setSearchStr(event.target.value)
    setSelectedCountry(null)
  }

  return (
    <div>
    <input value={searchStr} onChange={handleSearchStrChange}></input>
    {selectedCountry ? (
    <OneCountryView country={selectedCountry}></OneCountryView>
  ):(
    <SearchResult countries={countries} searchStr={searchStr} onShowCountry={setSelectedCountry}></SearchResult>
  )
}

    </div>
  )
}

export default App
