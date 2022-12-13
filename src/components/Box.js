import '../App.css'
import './Box.css'
import '../utils/Checkbox.css'
import CheckedImg from '../utils/res/checked.png'
import {min, max} from '../utils/Util.js'
// import checkedImg from '../res/checked.png'

const Box = ({checked, onClick, onEnter}) => {
  // console.log('checked', checked);
  return (
    <div className="boxContainer">
      <input
        type="checkbox"
        checked={checked}
        readOnly
        onClick={onClick}
        onMouseEnter={onEnter}
      />
    </div>
  )

  // const size='15px';
  // // const size='1.15em';
  //
  // return (
  //   <div tabIndex="0" className='box' onClick={onClick} onMouseEnter={onEnter} style={{width:size, height:size}}>
  //     {checked ? <img className='boxImg' src={checkedImg} width={size} height={size}/> : null}
  //   </div>
  // )
}

export default Box
