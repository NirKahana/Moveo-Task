import React, { useState, useEffect } from "react";
import { Howl, Howler } from "howler";
import Div100vh from 'react-div-100vh'
import { makeStyles } from "@material-ui/core/styles";

// importing all audio files
import BassAudio from "../loops/BassAudio.mp3";
import BreakbeatsAudio from "../loops/BreakbeatsAudio.mp3";
import SnareDrum from "../loops/SnareDrumAudio.mp3";
import DrumsAudio from "../loops/DrumsAudio.mp3";
import ElectricGuitarAudio from "../loops/ElectricGuitarAudio.mp3";
import FunkAudio from "../loops/FunkAudio.mp3";
import GrooveAudio from "../loops/GrooveAudio.mp3";
import MazePoliticsAudio from "../loops/MazePoliticsAudio.mp3";
import SynthesizerAudio from "../loops/SynthesizerAudio.mp3";
// importing all logos
import bassLogo from "../logos/bass-logo.png";
import breakbeatsLogo from "../logos/breakbeats-logo.png";
import snareDrumLogo from "../logos/snare-drums-logo.png";
import drumsLogo from "../logos/drums-logo.png";
import electricGuitarLogo from "../logos/electric-guitar-logo.png";
import funkLogo from "../logos/funk-logo.png";
import grooveLogo from "../logos/groove-logo.png";
import mazePoliticsLogo from "../logos/maze-logo.png";
import synthesizerLogo from "../logos/synth-logo.png";

// importing components
import Pad from "./Pad";
import ToolBar from "./ToolBar";

// Material UI styles
const useStyles = makeStyles({
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    minWidth: '300px',
    minHeight: '500px',
  },
  cardsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: 'scroll',
    flexGrow: "1",
    padding: '.5em .5em 4.5em .5em',
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  padsRow: {
    display: "flex",
    justifyContent: "center",
  },
  toolbarSpaceSaver: {
    padding: "2em 0",
    width: "100vw",
  },
});

// Creating Howl instances for all loop files
const bass = new Howl({src: [BassAudio],});
const breakbeats = new Howl({src: [BreakbeatsAudio],});
const snareDrum = new Howl({src: [SnareDrum],});
const drums = new Howl({src: [DrumsAudio],});
const electricGuitar = new Howl({src: [ElectricGuitarAudio],});
const funk = new Howl({src: [FunkAudio],});
const groove = new Howl({src: [GrooveAudio],});
const mazePolitics = new Howl({src: [MazePoliticsAudio],});
const synthesizer = new Howl({src: [SynthesizerAudio],});

const sounds = [bass, breakbeats, snareDrum, drums, electricGuitar, funk, groove, mazePolitics, synthesizer];
const soundNames = ["Bass", "BreakBeats", "Snare Drum", "Drums", "Electric Guitar", "Funk", "Groove", "Maze Politics", "Synthesizer"];
const soundLogos = [bassLogo, breakbeatsLogo, snareDrumLogo, drumsLogo, electricGuitarLogo, funkLogo, grooveLogo, mazePoliticsLogo, synthesizerLogo];
// Adding usefull props
sounds.forEach((sound, index) => {
    sound.name = soundNames[index];
    sound.logo = soundLogos[index];
});

export default function Home() {
  const classes = useStyles();

  // Indicates whether the loop machine is playing or not
  const [isMachinePlaying, setIsMachinePlaying] = useState(false);
  // An array of all the sounds (loops) that are currently playing
  const [currentlyPlayingSounds, setCurrentlyPlayingSounds] = useState([]);
  // An array of all the sounds (loops) that are activated, and waiting to be played in the next loop
  const [waitingList, setWaitingList] = useState([]);
  // The value of the volume slider 
  const [volumeSliderValue, setVolumeSliderValue] = useState(100);

  // useEffect: Every time one of the dependencies changes, an event-listener is created,
  // but only if the 'currently playing' list is not empty.
  // The event-listener listens to an 'end' event by the first sound in the 'currently playing' list.
  // When the sound completes a loop, the 'playAgain' function is called.
  useEffect(() => {
    // if the 'currently playing' list is not empty-
    if (currentlyPlayingSounds[0]) {
      // create an event-listener
      currentlyPlayingSounds[0].on("end", playAgain); 
    }
    // clean-up
    return () => {
      if (currentlyPlayingSounds[0]) {
        // cleaning the event-listener
        currentlyPlayingSounds[0].off("end");
      }
    };
  }, [currentlyPlayingSounds, waitingList]);
  
  // Starts the loop
  const onStart = () => {
    // Starts only if the app is not already playing and only if there is at least one activated pad
    if (!isMachinePlaying && waitingList[0]) {
      playWaitingList();
      setIsMachinePlaying(true);
    }
  };
  
  const playAgain = () => {
    // play again all the currently playing sounds
    currentlyPlayingSounds.forEach((sound) => {
      sound.play();
    });
    // if there are sounds on the waiting list, play them too
    if (waitingList[0]) {
      playWaitingList();
    }
  };

  // Stops the loop
  const onStop = () => {
    if (isMachinePlaying) {
      // Stops only if the app is playing
      // stops all sounds
      Howler.stop();
      // move all currently playing sounds to the waiting list
      setWaitingList([...waitingList, ...currentlyPlayingSounds]);
      // reset 'currently playing' list
      setCurrentlyPlayingSounds([]);
      setIsMachinePlaying(false);
    }
  };
  
  // onSoundClicked: Checks what was the sound's mode when it was clicked (playing/waiting/off)
  // and changes the sound mode accordingly
  const onSoundClicked = (clickedSound) => {
    // CASE 1) The sound was in 'playing' mode:
    const soundIndexInPlayingList = findSoundIndexInList(clickedSound, currentlyPlayingSounds);
    if (soundIndexInPlayingList !== -1) {
      // Turns it off
      clickedSound.stop();
      // Removes the sound from the list of currently playing sounds:
      const copyOfCurrentlyPlaying = currentlyPlayingSounds.slice();
      copyOfCurrentlyPlaying.splice(soundIndexInPlayingList, 1);
      setCurrentlyPlayingSounds(copyOfCurrentlyPlaying);
      // if there are no more sounds playing, set 'isMachinePlaying' to 'false'
      if (copyOfCurrentlyPlaying.length === 0) {
        setIsMachinePlaying(false);
      }
    } else {
      // CASE 2) The sound was in 'waiting' mode:
      const soundIndexInWaitingList = findSoundIndexInList(clickedSound, waitingList);
      if (soundIndexInWaitingList !== -1) {
        // Removes the sound from the waiting list:
        const copyOfWaitingList = waitingList.slice();
        copyOfWaitingList.splice(soundIndexInWaitingList, 1);
        setWaitingList(copyOfWaitingList);
      } else { 
        // CASE 3) The sound is turned OFF
        // Add it to the waiting list
        setWaitingList([...waitingList, clickedSound]);
      }
    }
  };

  const onVolumeChange = (volume) => {
    setVolumeSliderValue(volume);
    Howler.volume(volume / 100);
  };

  const playWaitingList = () => {
    // play every sound on the waiting list
    waitingList.forEach((sound) => {
      sound.play();
    });
    // add the sounds from the waiting list to the 'currently playing' list
    setCurrentlyPlayingSounds([...currentlyPlayingSounds, ...waitingList]);
    // empty the waiting list
    setWaitingList([]);
  };

  const findSoundIndexInList = (sound, list) => (
    list.findIndex((value) => value._sounds[0]._id === sound._sounds[0]._id)
  );

  return (
    <>
        <Div100vh className={classes.pageContainer}>
          <div className={classes.cardsContainer}>
            <div className={'grid'}>
              {sounds.map((sound, index) => (
                <Pad
                  key={index}
                  sound={sound}
                  onSoundClicked={onSoundClicked} 
                  isSoundWaiting={findSoundIndexInList(sound, waitingList) !== -1} 
                  isSoundPlaying={findSoundIndexInList(sound, currentlyPlayingSounds) !== -1}
                  isMachinePlaying={isMachinePlaying}
                />
              ))}
            </div>
          </div>
          <ToolBar
            onStart={onStart}
            onStop={onStop}
            isMachinePlaying={isMachinePlaying}
            volumeSliderValue={volumeSliderValue}
            onVolumeChange={onVolumeChange}
          />
        </Div100vh>
    </>
  );
}