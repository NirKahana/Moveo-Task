import React, { useState, useEffect } from 'react'
import { Howl, Howler } from 'howler';
import { makeStyles } from '@material-ui/core/styles';
import { Switch } from '@material-ui/core';
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
    flexWrap: 'wrap',
    overflow: 'hidden'
    // margin: '1em 0'
  },
  card: {
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
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#b0c0f4',
    },
  },
  switch: {
    margin: '0.5em 0',
    // marginTop: 'auto'
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
  },
  disabledIcon: {
    margin: '0 1em',
  }
});

// Creating Audio instances for all loop files
const bass = new Howl({
  src: [BassAudio],
  _loop: true,
});
const breakbeats = new Howl({
  src: [BreakbeatsAudio],
  _loop: true
})
const drumMachine = new Howl({
  src: [DrumMachineAudio],
  _loop: true
});
const drums = new Howl({
  src: [DrumsAudio],
  _loop: true
});
const electricGuitar = new Howl({
  src: [ElectricGuitarAudio],
  _loop: true
});
const funk = new Howl({
  src: [FunkAudio],
  _loop: true
});
const groove = new Howl({
  src: [GrooveAudio],
  _loop: true
});
const mazePolitics = new Howl({
  src: [MazePoliticsAudio],
  _loop: true
});
const synthesizer = new Howl({
  src: [SynthesizerAudio],
  _loop: true
});
// const sounds = [bass, breakbeats, drumMachine, drums, electricGuitar, funk, groove, mazePolitics, synthesizer]; 

export default function Home() {
  const classes = useStyles();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [record, setRecord] = useState({});
  const [currentlyPlayingSounds, setCurrentlyPlayingSounds] = useState([]);
  const [waitingList, setWaitingList] = useState([]);

  useEffect(() => {

  }, []);

  useEffect(() => {
    if(currentlyPlayingSounds[0]) {
      currentlyPlayingSounds[0].on('end', playAgain)
    }
    return () => {
      if(currentlyPlayingSounds[0]) {
        currentlyPlayingSounds[0].off('end');
      }
    }
  }, [currentlyPlayingSounds, waitingList]);

  // Starts the loop
  const onStart = () => {
    if(!isPlaying && waitingList[0]) { // Start only if the app is not playing
      playWaitingList();
      setIsPlaying(true);
    }
    if(isRecording) {

    }
  }

  // Stops the loop
  const onStop  = () => {
    if(isPlaying) { // Stop only if the app is playing
      // stop currently playing
      Howler.stop();
      // move all currently playing sounds that are switched on to the waiting list
      setWaitingList([...waitingList, ...currentlyPlayingSounds]);
      // reset currently playing list
      setCurrentlyPlayingSounds([]);
      setIsPlaying(false);
    }
  }

  // Turns a sound ON/OFF
  const onSwitch = (e, switchedSound) => {
    // If the switch has been turned ON
    if(e.target.checked) {
      // add this sound to the waiting list
      setWaitingList([...waitingList, switchedSound])  
    }
    else { // If the switch has been turned OFF
      // Check if this sound is currently playing
      if(currentlyPlayingSounds.find(sound => sound._sounds[0]._id === switchedSound._sounds[0]._id)) {
        // stop the sound
        switchedSound.stop();
        // remove the sound from the 'currently playing' list
        removeFromCurrentlyPlaying(switchedSound);
      } else { // If this sound is not currently playing
        // remove the sound from the waiting list
        removeFromWaitingList(switchedSound)
      }
    }
  }
  
  const removeFromWaitingList = (sound) => {
    // find this sounds's index within the waiting list
    const soundIndexInWaitingList = waitingList.findIndex(value => (
      value._sounds[0]._id === sound._sounds[0]._id
    ));
    // create a copy of the waiting list
    const copyOfWaitingList = waitingList.slice();
    // remove the sound from the copy of the waiting list
    copyOfWaitingList.splice(soundIndexInWaitingList, 1);
    // set the modified copy as the new waiting list
    setWaitingList(copyOfWaitingList);
  }

  const removeFromCurrentlyPlaying = (sound) => {
    // find the sound's index within the 'currently playing' list
    const soundIndexInCurrentlyPlaying = currentlyPlayingSounds.findIndex(value => (
      value._sounds[0]._id === sound._sounds[0]._id
    ));
    // create a copy of the 'currently playing' list
    const copyOfCurrentlyPlaying = currentlyPlayingSounds.slice();
    // remove the sound from the copy
    copyOfCurrentlyPlaying.splice(soundIndexInCurrentlyPlaying, 1);
    // set the modified copy as the new 'currently playing' list
    setCurrentlyPlayingSounds(copyOfCurrentlyPlaying);
    // if there are no more sounds playing, set 'isPlaying' to 'false' 
    if(copyOfCurrentlyPlaying.length === 0) {
      setIsPlaying(false)
    }
  }
  
  const playAgain = () => {
    // play again all the currently playing sounds
    currentlyPlayingSounds.forEach(sound => {
      sound.play();
    });
    // if there are sounds on the waiting list, play them too
    if(waitingList[0]) {
      playWaitingList();
    }
  }
  
  const playWaitingList = () => {
      // play every sound on the waiting list
      waitingList.forEach(sound => {
        sound.play();
      });
      // add the sounds from the waiting list to the 'currently playing' list
      setCurrentlyPlayingSounds([...currentlyPlayingSounds, ...waitingList]);
      // empty the waiting list
      setWaitingList([]);
  }

  return (
    <>
    <div className={classes.pageContainer}>
      <div className={classes.cardsContainer}>
        <div className={classes.card}>
          <div>Bass</div>
          <div className={classes.switch}><Switch onChange={(e) => {onSwitch(e, bass)}} color={'primary'} /></div>
        </div>
        <div className={classes.card}>
          <div>Break Beats</div>
          <div className={classes.switch}><Switch onChange={(e) => {onSwitch(e, breakbeats)}} color={'primary'} /></div>
        </div>
        <div className={classes.card}>
          <div>Drums</div>
          <div className={classes.switch}><Switch onChange={(e) => {onSwitch(e, drums)}} color={'primary'} /></div>
        </div>
        <div className={classes.card}>
          <div>Drum Machine</div>
          <div className={classes.switch}><Switch onChange={(e) => {onSwitch(e, drumMachine)}} color={'primary'} /></div>
        </div>
        <div className={classes.card}>
          <div>Electric Guitar</div>
          <div className={classes.switch}><Switch onChange={(e) => {onSwitch(e, electricGuitar)}} color={'primary'} /></div>
        </div>
        <div className={classes.card}>
          <div>Funk</div>
          <div className={classes.switch}><Switch onChange={(e) => {onSwitch(e, funk)}} color={'primary'} /></div>
        </div>
        <div className={classes.card}>
          <div>Groove</div>
          <div className={classes.switch}><Switch onChange={(e) => {onSwitch(e, groove)}} color={'primary'} /></div>
        </div>
        <div className={classes.card}>
          <div>Maze Politics</div>
          <div className={classes.switch}><Switch onChange={(e) => {onSwitch(e, mazePolitics)}} color={'primary'} /></div>
        </div>
        <div className={classes.card}>
          <div>Synthesizer</div>
          <div className={classes.switch}><Switch onChange={(e) => {onSwitch(e, synthesizer)}} color={'primary'} /></div>
        </div>
      </div>

      <div className={classes.toolbar}>
        <PlayCircleOutlineIcon  className={isPlaying ? classes.disabledIcon : classes.icon} onClick={onStart} fontSize={'large'} color={isPlaying ? 'disabled' : 'inherit'}/>
        <StopRoundedIcon  className={isPlaying ? classes.icon : classes.disabledIcon} onClick={onStop} fontSize={'large'} color={isPlaying ? 'inherit' : 'disabled'}/>
      </div>
    </div>
    </>
  )
}
