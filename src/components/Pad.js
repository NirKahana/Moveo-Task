import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import StopIcon from "@material-ui/icons/Stop";
import ReactLoading from "react-loading";

// material UI styles
const useStyles = makeStyles({
  padContainer: {
    // height: '10em',
    display: 'flex',
    flexDirection: 'column',
    width: '100%', // test,
    flexGrow: '1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pad: {
    position: "relative", //
    width: '100%',
    // maxWidth: '100%',
    height: '100%',
    maxHeight: '100%',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    border: "1px solid black",
    boxShadow: "0 3px 5px 2px #aea9a9",
    borderRadius: "10px",
    // borderRadius: "50%",
    cursor: "pointer",
  },
  sampleButton: {
    marginTop: 'auto',
    marginBottom: '3px'
  },
  loading: {
    bottom: '10%',
    marginTop: 'auto'
  },
  logo: {
    position: 'absolute',
  },
});

export default function Pad({
  sound,
  onSoundClicked,
  isSoundPlaying,
  isSoundWaiting,
  isMachinePlaying,
}) {
  const classes = useStyles();
   
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  const onSamplePlayed = (e) => {
    e.stopPropagation();
    setIsPlayingSample(true);
    sound.play();
  };
  const onSampleStopped = (e) => {
    e.stopPropagation();
    setIsPlayingSample(false);
    sound.stop();
  };
  const renderIcon = () => {
    if(isMachinePlaying) { // If the machine is playing 
      // if the sound is activated but still waiting to be played, return a 'waiting' icon
      if(isSoundWaiting) {
        return <ReactLoading type={'bubbles'} color={'black'} className={`${classes.sampleButton} ${classes.loading}`} height={'2em'} width={'2em'}/>
      } else { // sound is not activated, no icon.
        return null
      }
    } else { // Machine isn't playing
      if(isPlayingSample) {
        return (
          <StopIcon 
          classes={{root: classes.sampleButton}} 
          onClick={(e) => {onSampleStopped(e)}} 
        />
      );
    }
  }
    return (
        <PlayCircleFilledIcon
          classes={{root: classes.sampleButton}}
          onClick={(e) => {onSamplePlayed(e)}}
        />
      );
  };

  return (
    <div className={classes.padContainer}>
      <div
        className={
          (isSoundPlaying || isSoundWaiting)
            ? `${classes.pad} activatedColor pad-size`
            : `${classes.pad} deactivatedColor pad-size`
        }
        onClick={() => onSoundClicked(sound)}
      >
        <img src={sound.logo} className={classes.logo}/>
        {renderIcon()}
        {/* <ReactLoading type={'bubbles'} color={'black'} className={`${classes.sampleButton} ${classes.loading}`} height={'2em'} width={'2em'}/> */}
      </div>
    </div>  
  );
}
