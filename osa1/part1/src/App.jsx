const App = () => {
  const now=new Date();
  const a=10
  const b=20
  console.log(now,a+b)
  console.log("Hello from komponentti")
  return (
  <div>
    <h1>Greetings</h1>
    <Hello name="JOKU"/><Hello name="SAATANA"/>
  </div>
  )
}
const Hello = (props) => {
  return ( 
    <div>
      <p>Hello {props.name}</p>
    </div>
  )
}

export default App