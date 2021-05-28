import React, { useState, useEffect } from "react";
import { Howl, Howler } from "howler";
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
    height: "100vh",
    minWidth: '300px',
    minHeight: '500px',
    // backgroundColor: '#757680' //
  },
  cardsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // justifyContent: "space-evenly",
    alignItems: "center",
    overflow: 'scroll',
    // flexWrap: "wrap",
    flexGrow: "1",
    padding: '0.5em',
    // margin: "2em 0",
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
    // borderTop: "1px solid",
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
    if (!isMachinePlaying && waitingList[0]) {
      // Starts only if the app is not playing
      playWaitingList();
      setIsMachinePlaying(true);
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

  // onSoundClicked
  // description: Turns a sound ON/OFF.
  // clickedSound- The sound that has been clicked and needs to be turned ON/OFF
  const onSoundClicked = (clickedSound) => {
    // case 1) The sound is playing
    if (isSoundCurrentlyPlaying(clickedSound)) {
      // Turn it off
      clickedSound.stop();
      // then remove the sound from the list of currently playing sounds
      removeFromCurrentlyPlaying(clickedSound);
    } else {
      // case 2) The sound is turned ON but still waiting to be played
      if (isSoundInWaitingList(clickedSound)) {
        // Remove the sound from the waiting list
        removeFromWaitingList(clickedSound);
      } else { // case 3) The sound is turned OFF
        // Add it to the waiting list
        setWaitingList([...waitingList, clickedSound]);
      }
    }
  };

  const onVolumeChange = (volume) => {
    setVolumeSliderValue(volume);
    Howler.volume(volume / 100);
  };

  const removeFromWaitingList = (sound) => {
    // find this sounds's index within the waiting list
    const soundIndexInWaitingList = waitingList.findIndex(
      (value) => value._sounds[0]._id === sound._sounds[0]._id
    );
    // create a copy of the waiting list
    const copyOfWaitingList = waitingList.slice();
    // remove the sound from the copy of the waiting list
    copyOfWaitingList.splice(soundIndexInWaitingList, 1);
    // set the modified copy as the new waiting list
    setWaitingList(copyOfWaitingList);
  };

  const removeFromCurrentlyPlaying = (sound) => {
    // find the sound's index within the 'currently playing' list
    const soundIndexInCurrentlyPlaying = currentlyPlayingSounds.findIndex(
      (value) => value._sounds[0]._id === sound._sounds[0]._id
    );
    // create a copy of the 'currently playing' list
    const copyOfCurrentlyPlaying = currentlyPlayingSounds.slice();
    // remove the sound from the copy
    copyOfCurrentlyPlaying.splice(soundIndexInCurrentlyPlaying, 1);
    // set the modified copy as the new 'currently playing' list
    setCurrentlyPlayingSounds(copyOfCurrentlyPlaying);
    // if there are no more sounds playing, set 'isMachinePlaying' to 'false'
    if (copyOfCurrentlyPlaying.length === 0) {
      setIsMachinePlaying(false);
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

  const isSoundInWaitingList = (sound) => {
    return waitingList.find((value) => value._sounds[0]._id === sound._sounds[0]._id)
  }
  
  const isSoundCurrentlyPlaying = (sound) => (
    currentlyPlayingSounds.find((value) => value._sounds[0]._id === sound._sounds[0]._id)
  )
  
  return (
    <>
      <div className={classes.pageContainer}>
        <div className={classes.cardsContainer}>
          <div className={'grid'}>
            {sounds.map((sound) => (
              <Pad
                sound={sound}
                onSoundClicked={onSoundClicked} 
                isSoundWaiting={isSoundInWaitingList(sound)} 
                isSoundPlaying={isSoundCurrentlyPlaying(sound)}
                isMachinePlaying={isMachinePlaying}
              />
            ))}
          </div>
        </div>
        {/* <div className={classes.toolbarSpaceSaver}></div> */}
        <ToolBar
          onStart={onStart}
          onStop={onStop}
          isMachinePlaying={isMachinePlaying}
          volumeSliderValue={volumeSliderValue}
          onVolumeChange={onVolumeChange}
        />
      </div>
    </>
  );
}
