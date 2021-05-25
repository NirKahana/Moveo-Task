import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Switch } from '@material-ui/core';
import LoopRoundedIcon from '@material-ui/icons/LoopRounded';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import StopRoundedIcon from '@material-ui/icons/StopRounded';

// importing all audio files
import BassAudio from "../../loops/BassAudio.mp3"; 
import BreakbeatsAudio from "../../loops/BreakbeatsAudio.mp3"; 
import DrumMachineAudio from "../../loops/DrumMachineAudio.mp3"; 
import DrumsAudio from "../../loops/DrumsAudio.mp3"; 
import ElectricGuitarAudio from "../../loops/ElectricGuitarAudio.mp3"; 
import FunkAudio from "../../loops/FunkAudio.mp3"; 
import GrooveAudio from "../../loops/GrooveAudio.mp3"; 
import MazePoliticsAudio from "../../loops/MazePoliticsAudio.mp3"; 
import SynthesizerAudio from "../../loops/SynthesizerAudio.mp3"; 

// material UI styles
const useStyles = makeStyles({
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',  
    height: '100vh',
    backgroundColor: '#cde6fe78'
  },
  cardsContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    margin: '1em 0'
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid black',
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px #aea9a9',
    backgroundColor: '#a8b9f3',
    height: '10em',
    width: '8em',
  },
  switch: {
    margin: '0.5em 0',
    marginTop: 'auto'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 'auto',
    padding: '1em',
    backgroundColor: '#a8b9f3'
  },
  button: {
    margin: '0 1em'
  },
  icon: {
    margin: '0 1em',
    cursor: 'pointer'
  }
});

// Creating A udio instances for all loop files
const bass = new Audio(BassAudio);
const breakbeats = new Audio(BreakbeatsAudio);
const drumMachine = new Audio(DrumMachineAudio);
const drums = new Audio(DrumsAudio);
const electricGuitar = new Audio(ElectricGuitarAudio);
const funk = new Audio(FunkAudio);
const groove = new Audio(GrooveAudio);
const mazePolitics = new Audio(MazePoliticsAudio);
const synthesizer = new Audio(SynthesizerAudio);

export default function Home() {
  const classes = useStyles();
  const [isOn, setIsOn] = useState(false);
  const [loopIsOn, setLoopIsOn] = useState(true);
  const [loopsToPlay, setLoopsToPlay] = useState([bass, drumMachine, breakbeats]);

  useEffect(() => {
    // set the 'loop' attribute to 'true' for all the audio elements
    bass.loop = true;
    breakbeats.loop = true;
    drumMachine.loop = true;
    drums.loop = true;
    electricGuitar.loop = true;
    funk.loop = true;
    groove.loop = true;
    mazePolitics.loop = true;
    synthesizer.loop = true;
    console.log(drums.src);
  }, []);

  const addToList = (loop) => {
    setLoopsToPlay([...loopsToPlay, loop]);
  }
  const removeFromList = (loop) => {
    const copyOfLoopsToPlay = [...loopsToPlay];
    // copyOfLoopsToPlay.splice(loopIndex, 1)
    // setLoopsToPlay(newLoopsToPlay);
  }

  const start = () => {
    loopsToPlay.forEach(loop => loop.play());
    loopsToPlay.forEach(loop => loop.loop = true);
  }

  const loopSwitch = () => {
    if(loopIsOn) {
      setLoopIsOn(false);
      loopsToPlay.forEach(loop => loop.loop = false);
    } else {
      setLoopIsOn(true);
      loopsToPlay.forEach(loop => loop.loop = true);
    }
  }

  const stopImmediately  = () => {
    loopsToPlay.forEach(loop => loop.pause());
    loopsToPlay.forEach(loop => loop.currentTime = 0);
  }
  return (
    <>
    <div className={classes.pageContainer}>
      <div className={classes.cardsContainer}>
        <div className={classes.card}>
          <div>Bass</div>
          <div className={classes.switch}><Switch /></div>
        </div>
        <div className={classes.card}>
          <div>Drum Machine</div>
          <div className={classes.switch}><Switch /></div>
        </div>
        <div className={classes.card}>
          <div>Break Beats</div>
          <div className={classes.switch}><Switch /></div>
        </div>
      </div>

      <div className={classes.toolbar}>
        <PlayCircleOutlineIcon  className={classes.icon} onClick={start} fontSize={'large'}/>
        <StopRoundedIcon  className={classes.icon} onClick={stopImmediately} fontSize={'large'}/>
        <LoopRoundedIcon  className={classes.icon} onClick={loopSwitch} fontSize={'large'} color={loopIsOn ? 'primary' : 'disabled'}/>
      </div>
    </div>
    </>
  )
}
