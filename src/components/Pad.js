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
  sampleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sampleButton: {
    backgroundColor: '#adbdfc',
    fontSize: '0.7em',
    fontWeight: '600'
  },
  sampleLogo: {
    // position: "absolute",
    bottom: "0.5em",
  },
  hovered: {},
  loading: {
    // position: 'absolute'
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
  const [isStopButtonHovered, setIsStopButtonHovered] = useState(false);
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  const onSamplePlayed = () => {
    setIsPlayingSample(true);
    sound.play();
  };
  const onSampleStopped = () => {
    setIsPlayingSample(false);
    sound.stop();
  };
  const renderLogo = () => {
    // if(sound.playing()) {
    if (isMachinePlaying) {
      return null;
    }
    if (sound.playing()) {
      // if(isPlayingSample) {
      return (
        <StopIcon className={classes.sampleLogo} onClick={onSampleStopped} />
      );
    }
    if (isSampleButtonHovered) {
      return (
        <PlayCircleFilledIcon
          className={classes.sampleLogo}
          classes={{ root: classes.sampleLogo }}
          onMouseLeave={() => {
            setIsSampleButtonHovered(false);
          }}
          onClick={onSamplePlayed}
        />
      );
    }
    return (
      <PlayCircleOutlineIcon
        className={classes.sampleLogo}
        onMouseEnter={() => {
          setIsSampleButtonHovered(true);
        }}
      />
    );
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
        <img src={logo} className={classes.logo} />
      </div>
      {/* <div className={classes.sampleContainer}>
        <Button variant="contained" size={'small'} endIcon={renderLogo()} classes={{root: classes.sampleButton}}>Play Sample</Button>
      </div> */}
    </div>
  );
}
