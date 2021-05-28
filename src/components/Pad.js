import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ReactLoading from 'react-loading';

import bassLogo from "../logos/bass-logo.png"



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

export default function Pad({ padState, setPadState, sound, onSwitch, logo }) {  
  const classes = useStyles();

  return (
    <div
      className={padState ? `${classes.pad} activatedColor pad-size` : `${classes.pad} deactivatedColor pad-size`}
      onClick={() => onSwitch(sound, padState, setPadState)}
    >
      <div><img src={logo} /></div>
    </div>
  );
}
