import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ReactLoading from 'react-loading';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';


// material UI styles
const useStyles = makeStyles({
  pad: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    border: '1px solid black',
    boxShadow: '0 3px 5px 2px #aea9a9',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  loading: {
    // position: 'absolute'
  }
});

export default function Pad({ padState, setPadState, sound, onSwitch, name }) {  
  const classes = useStyles();

  return (
    <div
      className={padState ? `${classes.pad} activatedColor pad-size` : `${classes.pad} deactivatedColor pad-size`}
      // className={padState ? `${classes.activatedPad} pad-size` : `${classes.pad} pad-size`}
      onClick={() => onSwitch(sound, padState, setPadState)}
    >
      <div>{name}</div>
    </div>
  );
}
