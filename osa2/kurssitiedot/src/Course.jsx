const Course =(props)=>{
  return(
  <div>
      <Header course={props.course.name}></Header>
      <Content parts={props.course.parts}>
      </Content>
      <Total parts={props.course.parts}></Total>
    </div>)
}



const Part = (props) => {
  return (
    <p>{props.part} {props.exercises}</p>
  )
}

const Header = (props) => {
  return (
  <h2>{props.course}</h2>
  )
}

const Content = (props) => {
  return (
    <>
    {props.parts.map(part =>
      <Part key={part.id} part={part.name} exercises={part.exercises}></Part>
    )}
    </>
  )
}
const Total = ({parts}) =>{
  const tot=parts.map(part=> part.exercises).reduce((acc,cur) => acc+cur,0)
  return (
    <p style={{"fontWeight":"bold"}}>total of {tot} exercises</p>
  )
}

export default Course