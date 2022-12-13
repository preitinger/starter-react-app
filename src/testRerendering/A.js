import A1 from './A1'
import A2 from './A2'

const A = (props) => {
  return (
    <>
    <A1 key='A1' state={props.state}/>
    <A2 key='A2'/>
    </>
  )
}

export default A;
