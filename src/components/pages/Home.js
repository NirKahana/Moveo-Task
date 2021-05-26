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
// import DrumsAudio from "../../loops/DrumsAudio.mp3"; 
// import ElectricGuitarAudio from "../../loops/ElectricGuitarAudio.mp3"; 
// import FunkAudio from "../../loops/FunkAudio.mp3"; 
// import GrooveAudio from "../../loops/GrooveAudio.mp3"; 
// import MazePoliticsAudio from "../../loops/MazePoliticsAudio.mp3"; 
// import SynthesizerAudio from "../../loops/SynthesizerAudio.mp3"; 

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

// Creating Audio instances for all loop files
const bass = new Howl({
  src: [BassAudio],
  loop: true,
});
const breakbeats = new Howl({
  src: [BreakbeatsAudio],
  loop: true
})
const drumMachine = new Howl({
  src: [DrumMachineAudio],
  loop: true
});



export default function Home() {
  const classes = useStyles();
  
  const [loopIsOn, setLoopIsOn] = useState(true);
  let backgroundLoop;
  const mainLoop = () => {
    backgroundLoop = setTimeout(() => {
        // Do Something Here
        console.log('loop ended');
        // Then recall the parent function to
        // create a recursive loop.
        if(loopIsOn){
          mainLoop();
        }
    }, 2000);
    // }, bass.duration);
  }


  // useEffect(() => {
  //   bass.on('end', () => {console.log('ended')})
  // }, []);


  const onSwitch = (e, loopId, audioElement) => {
  //   if(e.target.checked) {
  //     addToAudiosToPlay(audioElement)
  //   } else { 
  //   removeFromAudiosToPlay(loopId);  
  //   audioElement.loop = false;
  //   }
  }
  
  const loopSwitch = () => {
    if(loopIsOn) {
      setLoopIsOn(false);
      // audioElements.forEach(loop => loop.loop = false);
    } else {
      setLoopIsOn(true);
      // audioElements.forEach(loop => loop.loop = true);
    }
  }

  const start = () => {
    mainLoop();
    setLoopIsOn(true);
  }

  const stop  = () => {
    Howler.stop();
    setLoopIsOn(false)
    clearTimeout(backgroundLoop);
  }
  const onEnded = () => {
    console.log('ended');
  }
  return (
    <>
    <div className={classes.pageContainer}>
      <div className={classes.cardsContainer}>
        <div className={classes.card}>
          <div>Bass</div>
          <div className={classes.switch}><Switch color={'primary'} /></div>
        </div>
        <div className={classes.card}>
          <div>Drum Machine</div>
          <div className={classes.switch}><Switch color={'primary'} /></div>
        </div>
        <div className={classes.card}>
          <div>Break Beats</div>
          <div className={classes.switch}><Switch color={'primary'} /></div>
        </div>
      </div>

      <div className={classes.toolbar}>
        <PlayCircleOutlineIcon  className={classes.icon} onClick={start} fontSize={'large'}/>
        <StopRoundedIcon  className={classes.icon} onClick={stop} fontSize={'large'}/>
        <LoopRoundedIcon  className={classes.icon} onClick={loopSwitch} fontSize={'large'} color={loopIsOn ? 'primary' : 'disabled'}/>
      </div>
    </div>
    </>
  )
}
