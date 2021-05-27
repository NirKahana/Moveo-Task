import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import StopRoundedIcon from '@material-ui/icons/StopRounded';
import MicIcon from '@material-ui/icons/Mic';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

// material UI styles
const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 'auto',
    height: '4em',
    // padding: '1em',
    backgroundColor: '#a8b9f3',
    borderTop: '1px solid',
    boxShadow: '1px 0px 6px 1px #aea9a9',
    position: 'fixed',
    bottom: '0',
    width: '100%'
  },
  icon: {
    margin: '1rem',
    cursor: 'pointer'
  },
  disabledIcon: {
    margin: '1rem',
  }
});
export default function ToolBar({ isPlaying, onStart, onStop, playRecord, record }) {
  const classes = useStyles();

  return (
    <div className={classes.toolbar}>
        <PlayCircleFilledIcon className={classes.icon} fontSize={'large'} onClick={playRecord}/>
        <MicIcon className={classes.icon} fontSize={'large'}/>
        <PlayCircleOutlineIcon  className={isPlaying ? classes.disabledIcon : classes.icon} onClick={onStart} fontSize={'large'} color={isPlaying ? 'disabled' : 'inherit'}/>
        <StopRoundedIcon  className={isPlaying ? classes.icon : classes.disabledIcon} onClick={onStop} fontSize={'large'} color={isPlaying ? 'inherit' : 'disabled'}/>
      </div>
  )
}
