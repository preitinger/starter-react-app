import React from 'react'
import {useState} from 'react'

import A from './A'
import B from './B'

const Root = (props) => {
  const [state, setState] = useState(0);

  const onClick = (event) => {
    setState(draft => draft + 1);
  }
  console.log("render Root");
  return (
    <React.StrictMode>
      <A state={state}/>
      <B state={state}/>
      <button onClick={onClick}>inc state</button>
    </React.StrictMode>
  )
}

export default Root;
