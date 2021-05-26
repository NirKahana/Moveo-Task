import React, { useState, useEffect, useRef } from 'react'
import { Howl, Howler } from 'howler';
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
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px #aea9a9',
    backgroundColor: '#a8b9f3',
    height: '8em',
    width: '8em',
    borderRadius: '50%',
    margin: '1em'
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
const sounds = [bass, breakbeats, drumMachine, drums, electricGuitar, funk, groove, mazePolitics, synthesizer]; 
// const sortedArray = sounds.sort((a, b) => a._duration-b._duration);
// console.log('durations: ', [...sounds.map(sound => sound._duration)]);

sounds.forEach(sound => {
  // sound.loop(true);
  console.log(sound.duration());
});


export default function Home() {
  const classes = useStyles();

  const [isPlaying, setIsPlaying] = useState(false);
  // const [loopIsOn, setLoopIsOn] = useState(true);
  const [currentlyPlayingSounds, setCurrentlyPlayingSounds] = useState([]);
  const [waitingList, setWaitingList] = useState([]);

  useEffect(() => {
    // console.log("bass: ", bass);
    // console.log("bass._loop: ", bass._loop);

    // bass.on('end', () => {
    //   console.log('bass loop ended');
    //   console.log('bass.loop: ', bass._loop);
    // })
    
    // console.log('durations: ', sounds[0]._duration);
    // console.log('durations: ', [...sounds.map(sound => ({duration: sound._duration, src: sound._src}))]);
  }, []);

  // console.log(sortedArray.map(sound => sound._duration));

  useEffect(() => {
    if(currentlyPlayingSounds[0]) {
      currentlyPlayingSounds[0].on('end', playCurrentlyPlaying)
    }
    return () => {
      if(currentlyPlayingSounds[0]) {
        currentlyPlayingSounds[0].off('end');
      }
    }
  }, [currentlyPlayingSounds, waitingList]);


  const onSwitch = (e, switchedSound) => {
    // If the switch has been turned ON
    if(e.target.checked) {
      addToWaitingList(switchedSound);
    } 
    else { // If the switch has been turned OFF
      // Check if this sound is currently playing
      if(currentlyPlayingSounds.find(sound => sound._sounds[0]._id === switchedSound._sounds[0]._id)) {
        switchedSound.stop();
        removeFromCurrentlyPlaying(switchedSound);
      } else { // If this sound is not currently playing 
        removeFromWaitingList(switchedSound)
      }
    }
  }
  
  // const onLoopButtonClicked = () => {
  //   if(loopIsOn) {
  //     console.log('onLoopButtonClicked, loop was true');
  //     setLoopIsOn(false);
  //     sounds.forEach(sound => sound(loop) = false);
  //     // bass.loop(false);
  //   } else {
  //     console.log('onLoopButtonClicked, loop was false');
  //     setLoopIsOn(true);
  //     // sounds.forEach(sound => sound._loop = true);
  //     bass.loop(true);
  //   }
  // }

  const onStart = () => {
    if(!isPlaying && waitingList[0]) { // Start only if the app is not playing
      playWaitingList();
      setIsPlaying(true);
    }
  }

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
  const addToWaitingList = (sound) => {
    // if(loopIsOn) {
    //   sound._loop = true;
    // } else {
    //   sound._loop = false
    // }
    setWaitingList([...waitingList, sound])  
  }
  
  const removeFromWaitingList = (sound) => {
    const soundIndexInWaitingList = waitingList.findIndex(value => (
      value._sounds[0]._id === sound._sounds[0]._id
    ));
    const copyOfWaitingList = waitingList.slice();
    copyOfWaitingList.splice(soundIndexInWaitingList, 1);
    setWaitingList(copyOfWaitingList);
  }

  const removeFromCurrentlyPlaying = (sound) => {
    const soundIndexInCurrentlyPlaying = currentlyPlayingSounds.findIndex(value => (
      value._sounds[0]._id === sound._sounds[0]._id
    ));
    const copyOfCurrentlyPlaying = currentlyPlayingSounds.slice();
    copyOfCurrentlyPlaying.splice(soundIndexInCurrentlyPlaying, 1);
    setCurrentlyPlayingSounds(copyOfCurrentlyPlaying);
    if(copyOfCurrentlyPlaying.length === 0) {
      setIsPlaying(false)
    }
  }
  
  const playCurrentlyPlaying = () => {
    currentlyPlayingSounds.forEach(sound => {
      sound.play();
    });
    if(waitingList[0]) {
      playWaitingList();
    }
  }
  
  const playWaitingList = () => {
      waitingList.forEach(sound => {
        sound.play();
      });
      moveWaitingListToCurrentlyPlaying();
      setWaitingList([]);
  }

  const moveWaitingListToCurrentlyPlaying = () => {
    setCurrentlyPlayingSounds([...currentlyPlayingSounds, ...waitingList]);
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
        {/* <LoopRoundedIcon  className={classes.icon} onClick={onLoopButtonClicked} fontSize={'large'} color={loopIsOn ? 'primary' : 'disabled'}/> */}
      </div>
    </div>
    </>
  )
}
