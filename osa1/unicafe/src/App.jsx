import { useState } from 'react'

const Button=(props) => {
  return(
  <button onClick={props.onClick}>
    {props.text}
  </button>
  )
}

const StatisticLine=({text,value}) =>{
  if (text=="positive"){
    return(
    <tr>
      <td>{text}</td>
      <td>{value} %</td>
    </tr>
    )
  }
  return(
  <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
} 


const Statistics = ({good,neutral,bad}) => {
  if (good==0 && neutral==0 && bad==0){
    return(<>
    <p>No feedback given</p></>)
  }
  const all=good+neutral+bad
  const average=(good*1+bad*-1)/all
  const positive=(good/all)*100
  return (
  <div>
  <table>
  <StatisticLine text="good" value={good}/>
  <StatisticLine text="neutral" value={neutral}/>
  <StatisticLine text="bad" value={bad}/>
  <StatisticLine text="all" value={all}/>
  <StatisticLine text="average" value={average}/>
  <StatisticLine text="positive" value={positive}/>
  </table>
  </div>)
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  

  return (
    <div>
      <h1>give feedback</h1>
        <Button onClick={() => setGood(good+1)} text="good" />
        <Button onClick={() => setNeutral(neutral+1)} text="neutral" />
        <Button onClick={() => setBad(bad+1)} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}></Statistics>
      
    </div>
  )
}

export default App