import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import StopIcon from "@material-ui/icons/Stop";
import Button from '@material-ui/core/Button';
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
  padState,
  setPadState,
  sound,
  onSwitch,
  logo,
  isMachinePlaying,
}) {
  const classes = useStyles();
  
  const [isSampleButtonHovered, setIsSampleButtonHovered] = useState(false);
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
  const renderSampleButton = () => {
    if (isMachinePlaying) {
      return null;
    }
    // if (sound.playing()) {
      if(isPlayingSample) {
      return (
        <StopIcon 
          classes={{root: classes.sampleButton}} 
          onClick={(e) => {onSampleStopped(e)}} 
        />
      );
    }
      return (
        <PlayCircleFilledIcon
          classes={{root: classes.sampleButton}}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setIsSampleButtonHovered(false);
          }}
          onClick={(e) => {onSamplePlayed(e)}}
        />
      );
    // return (
    //   <PlayCircleOutlineIcon
    //     classes={{root: classes.sampleButton}}
    //     onMouseEnter={() => {
    //       setIsSampleButtonHovered(true);
    //     }}
    //   />
    // );
  };

  return (
    <div className={classes.padContainer}>
      <div
        className={
          padState
            ? `${classes.pad} activatedColor pad-size`
            : `${classes.pad} deactivatedColor pad-size`
        }
        onClick={() => onSwitch(sound, padState, setPadState)}
      >
        <img src={logo} className={classes.logo}/>
        {renderSampleButton()}
      </div>
    </div>  
  );
}
