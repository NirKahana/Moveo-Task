import React, { useState, useEffect } from 'react'
import { Howl, Howler } from 'howler';
import { makeStyles } from '@material-ui/core/styles';

// importing all audio files
import BassAudio from "../loops/BassAudio.mp3"; 
import BreakbeatsAudio from "../loops/BreakbeatsAudio.mp3"; 
import DrumMachineAudio from "../loops/DrumMachineAudio.mp3"; 
import DrumsAudio from "../loops/DrumsAudio.mp3"; 
import ElectricGuitarAudio from "../loops/ElectricGuitarAudio.mp3"; 
import FunkAudio from "../loops/FunkAudio.mp3"; 
import GrooveAudio from "../loops/GrooveAudio.mp3"; 
import MazePoliticsAudio from "../loops/MazePoliticsAudio.mp3"; 
import SynthesizerAudio from "../loops/SynthesizerAudio.mp3"; 

// importing components 
import Pad from "./Pad";
import ToolBar from "./ToolBar";

// Material UI styles
const useStyles = makeStyles({
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',  
    height: '100vh',
  },
  cardsContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    flexGrow: '1',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  toolbarSpaceSaver: {
    padding: '2em 0',
    width: '100vw'
  }
});

// Creating Howl instances for all loop files
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

export default function Home() {
  const classes = useStyles();
  
  // Indicates whether the loop machine is playing or not
  const [isPlaying, setIsPlaying] = useState(false);
  // An array of all the sounds (loops) that are currently playing 
  const [currentlyPlayingSounds, setCurrentlyPlayingSounds] = useState([]);
  // An array of all the sounds (loops) that are activated, and waiting to be played in the next loop
  const [waitingList, setWaitingList] = useState([]);

  // These states only indicate whether the pad is activated (not necessarily playing yet) or not activated.
  // The states are used for the 'onSwitch' function.
  const [bassIsOn, setBassIsOn] = useState(false);
  const [breakbeatsIsOn, setBreakbeatsIsOn] = useState(false);
  const [drumMachineIsOn, setDrumMachineIsOn] = useState(false);
  const [drumsIsOn, setDrumsIsOn] = useState(false);
  const [electricGuitarIsOn, setElectricGuitarIsOn] = useState(false);
  const [funkIsOn, setFunkIsOn] = useState(false);
  const [grooveIsOn, setGrooveIsOn] = useState(false);
  const [mazePoliticsIsOn, setMazePoliticsIsOn] = useState(false);
  const [synthesizerIsOn, setSynthesizerIsOn] = useState(false);


  // const [isRecording, setIsRecording] = useState(false);
  // const [isStreamimgRecord, setIsStreamingRecord] = useState(false);
  // the 
  const [record, setRecord] = useState({
    initials: ['bass'],
    commands: [
      // {timeStamp: 3000, string: 'start'},
      // {timeStamp: 8000, string: 'drum-machine'},
      // {timeStamp: 5000, string: 'drum-machine'},
      // {timeStamp: 18000,string: 'stop'}
    ]  
  });
  // const [recordTimer, setRecordTimer] = useState(0);
  
  // useEffect: Every time one of the dependencies changes, an event-listener is created,
  // but only if the 'currently playing' list is not empty. 
  // The event-listener listens to an 'end' event by the first sound in the 'currently playing' list.
  // When the sound completes a loop, the 'playAgain' function is called,
  // which plays again the sounds that were played before and also the sounds on the waiting list. 
  useEffect(() => {
    if(currentlyPlayingSounds[0]) { 
      currentlyPlayingSounds[0].on('end', playAgain)
    }
    // clean-up
    return () => {
      if(currentlyPlayingSounds[0]) {
        currentlyPlayingSounds[0].off('end');
      }
    }
  }, [currentlyPlayingSounds, waitingList]);
  
  // Starts the loop
  const onStart = () => {
    if(!isPlaying && waitingList[0]) { // Starts only if the app is not playing
      playWaitingList();
      setIsPlaying(true);
    }
  }
  
  // Stops the loop
  const onStop  = () => {
    if(isPlaying) { // Stops only if the app is playing
      // stops all sounds
      Howler.stop();
      // move all currently playing sounds to the waiting list
      setWaitingList([...waitingList, ...currentlyPlayingSounds]);
      // reset 'currently playing' list
      setCurrentlyPlayingSounds([]);
      setIsPlaying(false);
    }
  }
  
  // onSwitch
  // description: Turns a sound ON/OFF.
  // Params:
  // switchedSound- the sound that has been clicked and needs to be switched
  // padState- the previous state of the sound's pad (ON/OFF)
  // setPadState- a setter function that changes 'padState'
  const onSwitch = (switchedSound, padState, setPadState) => {
    // Switch the pad's state (ON/OFF)
    setPadState(!padState);
    // If the pad state was OFF and has been turned ON:
    if(!padState) { // *** 'padState' still refers to the pad's state before it was clicked!
      // then add this sound to the waiting list
      setWaitingList([...waitingList, switchedSound]);
    }
    else { // The pad state was ON and has been turned OFF: 
      // Check if this sound is currently playing
      if(currentlyPlayingSounds.find(sound => sound._sounds[0]._id === switchedSound._sounds[0]._id)) {
        // if it is playing, stop the sound
        switchedSound.stop();
        // then remove the sound from the 'currently playing' list
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

  const playRecord = () => {
    // starts only if the machine is not playing
    if(!isPlaying) {
      // reset all pads to OFF and empty the waiting list
      resetMachine();
      // activated the initial pads supplied by the record
      activateInitialSounds(record.initials);
      // start playing the record
      runCommands(record.commands);
    }
  }
  const resetMachine = () => {

    setWaitingList(prevState => []);
    setBassIsOn(prevState => false)
    setBreakbeatsIsOn(prevState => false)
    setDrumMachineIsOn(prevState => false)
    setDrumsIsOn(prevState => false)
    setElectricGuitarIsOn(prevState => false)
    setFunkIsOn(prevState => false)
    setGrooveIsOn(prevState => false)
    setMazePoliticsIsOn(prevState => false)
    setSynthesizerIsOn(prevState => false)
  }
  const activateInitialSounds = (initialSoundsArray) => {
    initialSoundsArray.forEach(soundString => runOneCommand(soundString))
  }
  // runOneCommand
  // Description: Takes a string of a command, and runs the corresponding command
  // for example: the string 'start' will run the 'onStart' function 
  const runOneCommand = (commandString) => {
    switch (commandString) {
      case 'bass':
        return onSwitch(bass, bassIsOn, setBassIsOn)
      case 'breakbeats':
        return onSwitch(breakbeats, breakbeatsIsOn, setBreakbeatsIsOn)
      case 'drum-machine':
        return onSwitch(drumMachine, drumMachineIsOn, setDrumMachineIsOn)
      case 'drums':
        return onSwitch(drums, drumsIsOn, setDrumsIsOn)
      case 'electric-guitar':
        return onSwitch(electricGuitar, electricGuitarIsOn, setElectricGuitarIsOn)
      case 'funk':
        return onSwitch(funk, funkIsOn, setFunkIsOn)
      case 'groove':
        return onSwitch(groove, grooveIsOn, setGrooveIsOn)
      case 'maze-politics':
        return onSwitch(mazePolitics, mazePoliticsIsOn, setMazePoliticsIsOn)
      case 'synthesizer':
        return onSwitch(synthesizer, synthesizerIsOn, setSynthesizerIsOn)
      case 'start':
        return onStart()
      case 'stop':
        return onStop()
      case 'end':
        return endStream()
    }
  }

  // runCommands
  // Description: Takes an array of commands and timestamps, and runs
  // every command at its time, one after another.
  // const runCommands = (commandsArray) => {
  //   commandsArray.forEach(command => {
  //     setTimeout(() => {
  //       runOneCommand(command.string);
  //     }, command.timeStamp);
  //   })
  // }
   
  const runCommands = (commandsArray) => {
      runSingleCommand(commandsArray, 0)
  }

  const runSingleCommand = (array, index) => {
    if(array[index]) {
      console.log('run single command. index: ', index);
      setTimeout(() => {
        runOneCommand(array[index].string);
        runSingleCommand(array, index+1)
      }, array[index].timeStamp)
    }
  }
  const endStream = () => {

  }
 
  return (
    <>
    <div className={classes.pageContainer}>
      {/* <h3>Waiting list length: {waitingList.map(sound => <span>{sound._src}</span>)}</h3> */}
      <div className={classes.cardsContainer}>
        <Pad name={'Bass'} sound={bass} padState={bassIsOn} setPadState={setBassIsOn} onSwitch={onSwitch} />
        <Pad name={'Breakbeats'} sound={breakbeats} padState={breakbeatsIsOn} setPadState={setBreakbeatsIsOn} onSwitch={onSwitch} />
        <Pad name={'Drums'} sound={drums} padState={drumsIsOn} setPadState={setDrumsIsOn} onSwitch={onSwitch}/>
        <Pad name={'Drum Machine'} sound={drumMachine} padState={drumMachineIsOn} setPadState={setDrumMachineIsOn} onSwitch={onSwitch}/>
        <Pad name={'Electric Guitar'} sound={electricGuitar} padState={electricGuitarIsOn} setPadState={setElectricGuitarIsOn} onSwitch={onSwitch}/>
        <Pad name={'Funk'} sound={funk} padState={funkIsOn} setPadState={setFunkIsOn} onSwitch={onSwitch}/>
        <Pad name={'Groove'} sound={groove} padState={grooveIsOn} setPadState={setGrooveIsOn} onSwitch={onSwitch}/>
        <Pad name={'Maze Politics'} sound={mazePolitics} padState={mazePoliticsIsOn} setPadState={setMazePoliticsIsOn} onSwitch={onSwitch}/>
        <Pad name={'Synthesizer'} sound={synthesizer} padState={synthesizerIsOn} setPadState={setSynthesizerIsOn} onSwitch={onSwitch}/>
      </div>
      <div className={classes.toolbarSpaceSaver}></div>
      <ToolBar onStart={onStart} onStop={onStop} isPlaying={isPlaying} playRecord={playRecord} record={record}/>
    </div>
    </>
  )
}
