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
    alignItems: 'center',
    justifySelf: 'flex-end',
    width: '12em'
  },
  slider: {
    // width: '10%',
    margin: 'auto 0'
  },
});

export default function ToolBar({ isMachinePlaying, onStart, onStop, volumeSliderValue, onVolumeChange }) {
  const classes = useStyles();  

  return (
    <div className={classes.toolbar}>
      <PlayCircleOutlineIcon  className={isMachinePlaying ? classes.disabledIcon : classes.icon} onClick={onStart} fontSize={'large'} color={isMachinePlaying ? 'disabled' : 'inherit'}/>
      <StopRoundedIcon  className={isMachinePlaying ? classes.icon : classes.disabledIcon} onClick={onStop} fontSize={'large'} color={isMachinePlaying ? 'inherit' : 'disabled'}/>
      <div className={classes.volumeContainer}>
        <VolumeDown className={classes.disabledIcon} fontSize={'small'}/>
        <Slider className={`${classes.slider}`} value={volumeSliderValue} onChange={(e, newValue) => {onVolumeChange(newValue)}} aria-labelledby="continuous-slider" />
        <VolumeUp className={classes.disabledIcon} fontSize={'small'}/>
      </div>
    </div>
  )
}
