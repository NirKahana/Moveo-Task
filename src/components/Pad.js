import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import StopIcon from "@material-ui/icons/Stop";
import ReactLoading from "react-loading";

// material UI styles
const useStyles = makeStyles({
  padContainer: {
    height: '10em',
    display: 'flex',
    alignItems: 'center'
  },
  pad: {
    position: "relative", //
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    border: "1px solid black",
    boxShadow: "0 3px 5px 2px #aea9a9",
    borderRadius: "50%",
    cursor: "pointer",
  },
  sampleButton: {
    marginTop: 'auto',
    marginBottom: '3px'
  },
  logo: {
    position: 'absolute',
  },
});

export default function Pad({
  sound,
  onSoundClicked,
  isSoundActivated,
  isSoundInWaitingList,
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
      if(isSoundInWaitingList(sound)) {
        return <ReactLoading type={'bubbles'} color={'black'} className={classes.sampleButton} height={'2em'} width={'2em'}/>
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
          (isSoundActivated(sound))
            ? `${classes.pad} activatedColor pad-size`
            : `${classes.pad} deactivatedColor pad-size`
        }
        onClick={() => onSoundClicked(sound)}
      >
        <img src={sound.logo} className={classes.logo}/>
        {renderIcon()}
      </div>
    </div>  
  );
}
