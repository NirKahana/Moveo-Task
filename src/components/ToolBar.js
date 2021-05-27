import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import StopRoundedIcon from '@material-ui/icons/StopRounded';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';

// material UI styles
const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    height: '4em',
    backgroundColor: '#a8b9f3',
    borderTop: '1px solid',
    boxShadow: '1px 0px 6px 1px #aea9a9',
    position: 'fixed',
    bottom: '0',
    width: '100%',
    minWidth: '320px'
  },
  icon: {
    margin: '1rem',
    cursor: 'pointer'
  },
  disabledIcon: {
    margin: '1rem',
  },
  volumeContainer: {
    display: 'flex',
    width: '90%'
  },
  slider: {
    width: '30%',
    margin: 'auto 0'
  },
});
export default function ToolBar({ isPlaying, onStart, onStop, volumeSliderValue, onVolumeChange }) {
  const classes = useStyles();

  return (
    <div className={classes.toolbar}>
      <PlayCircleOutlineIcon  className={isPlaying ? classes.disabledIcon : classes.icon} onClick={onStart} fontSize={'large'} color={isPlaying ? 'disabled' : 'inherit'}/>
      <StopRoundedIcon  className={isPlaying ? classes.icon : classes.disabledIcon} onClick={onStop} fontSize={'large'} color={isPlaying ? 'inherit' : 'disabled'}/>
        <VolumeDown className={classes.disabledIcon} fontSize={'large'}/>
        <Slider className={classes.slider} value={volumeSliderValue} onChange={(e, newValue) => {onVolumeChange(newValue)}} aria-labelledby="continuous-slider" />
        <VolumeUp className={classes.disabledIcon} fontSize={'large'}/>
    </div>
  )
}
