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
    backgroundColor: '#ccdafc',
    height: '8em',
    width: '8em',
    margin: '0 6vw',
    borderRadius: '50%',
    // margin: '1em 3em',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#a8b9f3cc',
    }
  },
  activatedPad: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    border: '1px solid black',
    boxShadow: '0 3px 5px 2px #aea9a9',
    backgroundColor: '#a8b9f3',
    height: '8em',
    width: '8em',
    borderRadius: '50%',
    // margin: '1em 3em',
    cursor: 'pointer'
  },
  volumeContainer: {
    display: 'flex',
    width: '90%'
  },
  slider: {
    width: '50%',
    margin: '0 0.4em'
  },
  loading: {
    // position: 'absolute'
  }
});

export default function Pad({ padState, setPadState, sound, onSwitch, name }) {  
  const classes = useStyles();

  return (
    <div
      className={padState ? `${classes.activatedPad} pad-size` : `${classes.pad} pad-size`}
      onClick={() => onSwitch(sound, padState, setPadState)}
    >
      <div>{name}</div>
    </div>
  );
}
