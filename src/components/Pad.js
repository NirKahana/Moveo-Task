import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ReactLoading from 'react-loading';

// material UI styles
const useStyles = makeStyles({
  pad: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid black',
    boxShadow: '0 3px 5px 2px #aea9a9',
    backgroundColor: '#ccdafc',
    // backgroundColor: '#a8b9f3',
    height: '8em',
    width: '8em',
    borderRadius: '50%',
    margin: '1em 3em',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#a8b9f3cc',
    }
  },
  activatedPad: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid black',
    boxShadow: '0 3px 5px 2px #aea9a9',
    backgroundColor: '#a8b9f3',
    height: '8em',
    width: '8em',
    borderRadius: '50%',
    margin: '1em 3em',
    cursor: 'pointer'
  },
  loading: {
    // position: 'absolute'
  }
});

export default function Pad({ padState, setPadState, sound, onSwitch, name }) {  
  const classes = useStyles();

  return (
    <div
      className={padState ? classes.activatedPad : classes.pad}
      onClick={() => onSwitch(sound, padState, setPadState)}
    >
      <div>{name}</div>
      {/* <ReactLoading type={'bubbles'} color={'rgb(114 114 114)'} height={'87'} width={'87'} className={classes.loading}/> */}
    </div>
  );
}
