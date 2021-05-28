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
import bassLogo from "../logos/bass-logo.png"
import breakbeatsLogo from "../logos/breakbeats-logo.png"
import snareDrumLogo from "../logos/snare-drums-logo.png"
import drumsLogo from "../logos/drums-logo.png"
import electricGuitarLogo from "../logos/electric-guitar-logo.png"
import funkLogo from "../logos/funk-logo.png"
import grooveLogo from "../logos/groove-logo.png"
import mazePoliticsLogo from "../logos/maze-logo.png"
import synthesizerLogo from "../logos/synth-logo.png"


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
  },
  cardsContainer: {
    display: "flex",
    flexDirection: 'column',
    justifyContent: "space-between",
    flexWrap: "wrap",
    flexGrow: "1",
    // margin: "2em 0",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  padsRow: {
    display: 'flex',
    justifyContent: 'center'
  },
  toolbarSpaceSaver: {
    padding: "2em 0",
    width: "100vw",
    borderTop: "1px solid",
  },
});

// Creating Howl instances for all loop files
const bass = new Howl({
  src: [BassAudio],
  // _loop: true,
});
const breakbeats = new Howl({
  src: [BreakbeatsAudio],
});
const snareDrum = new Howl({
  src: [SnareDrum],
});
const drums = new Howl({
  src: [DrumsAudio],
});
const electricGuitar = new Howl({
  src: [ElectricGuitarAudio],
});
const funk = new Howl({
  src: [FunkAudio],
});
const groove = new Howl({
  src: [GrooveAudio],
});
const mazePolitics = new Howl({
  src: [MazePoliticsAudio],
});
const synthesizer = new Howl({
  src: [SynthesizerAudio],
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
  const [snareDrumIsOn, setSnareDrumIsOn] = useState(false);
  const [drumsIsOn, setDrumsIsOn] = useState(false);
  const [electricGuitarIsOn, setElectricGuitarIsOn] = useState(false);
  const [funkIsOn, setFunkIsOn] = useState(false);
  const [grooveIsOn, setGrooveIsOn] = useState(false);
  const [mazePoliticsIsOn, setMazePoliticsIsOn] = useState(false);
  const [synthesizerIsOn, setSynthesizerIsOn] = useState(false);

  const [volumeSliderValue, setVolumeSliderValue] = useState(100);

  // useEffect: Every time one of the dependencies changes, an event-listener is created,
  // but only if the 'currently playing' list is not empty.
  // The event-listener listens to an 'end' event by the first sound in the 'currently playing' list.
  // When the sound completes a loop, the 'playAgain' function is called,
  // which plays again the sounds that were played before and also the sounds on the waiting list.
  useEffect(() => {
    if (currentlyPlayingSounds[0]) {
      currentlyPlayingSounds[0].on("end", playAgain);
    }
    // clean-up
    return () => {
      if (currentlyPlayingSounds[0]) {
        currentlyPlayingSounds[0].off("end");
      }
    };
  }, [currentlyPlayingSounds, waitingList]);

  // Starts the loop
  const onStart = () => {
    if (!isPlaying && waitingList[0]) {
      // Starts only if the app is not playing
      playWaitingList();
      setIsPlaying(true);
    }
  };

  // Stops the loop
  const onStop = () => {
    if (isPlaying) {
      // Stops only if the app is playing
      // stops all sounds
      Howler.stop();
      // move all currently playing sounds to the waiting list
      setWaitingList([...waitingList, ...currentlyPlayingSounds]);
      // reset 'currently playing' list
      setCurrentlyPlayingSounds([]);
      setIsPlaying(false);
    }
  };

  // onSwitch
  // description: Turns a sound ON/OFF.
  // Params:
  // switchedSound- the sound that has been clicked and needs to be switched
  // padState- the previous state of the sound's pad (ON/OFF)
  // setPadState- a setter function that changes 'padState'
  const onSwitch = (switchedSound, padState, setPadState) => {
    // Switch the pad's state (ON/OFF)
    // setPadState({ ...padState, clicked: !padState.clicked });
    setPadState(!padState);
    // If the pad state was OFF and has been turned ON:
    if (!padState) {
      // *** 'padState' still refers to the pad's state before it was clicked!
      // then add this sound to the waiting list
      setWaitingList([...waitingList, switchedSound]);
    } else {
      // The pad state was ON and has been turned OFF:
      // Check if this sound is currently playing
      if (
        currentlyPlayingSounds.find(
          (sound) => sound._sounds[0]._id === switchedSound._sounds[0]._id
        )
      ) {
        // if it is playing, stop the sound
        switchedSound.stop();
        // then remove the sound from the 'currently playing' list
        removeFromCurrentlyPlaying(switchedSound);
      } else {
        // If this sound is not currently playing
        // remove the sound from the waiting list
        removeFromWaitingList(switchedSound);
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
    // if there are no more sounds playing, set 'isPlaying' to 'false'
    if (copyOfCurrentlyPlaying.length === 0) {
      setIsPlaying(false);
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

  return (
    <>
      <div className={classes.pageContainer}>
        <div className={`${classes.cardsContainer} cards-container-margin`}>
          <div className={classes.padsRow}>
            <Pad
              name={"Bass"}
              sound={bass}
              logo={bassLogo}
              padState={bassIsOn}
              setPadState={setBassIsOn}
              onSwitch={onSwitch}
            />
            <Pad
              name={"Breakbeats"}
              sound={breakbeats}
              logo={breakbeatsLogo}
              padState={breakbeatsIsOn}
              setPadState={setBreakbeatsIsOn}
              onSwitch={onSwitch}
            />
            <Pad
              name={"Drums"}
              sound={drums}
              logo={drumsLogo}
              padState={drumsIsOn}
              setPadState={setDrumsIsOn}
              onSwitch={onSwitch}
            />
          </div>
          <div className={classes.padsRow}>
            <Pad
              name={"Snare Drum"}
              sound={snareDrum}
              logo={snareDrumLogo}
              padState={snareDrumIsOn}
              setPadState={setSnareDrumIsOn}
              onSwitch={onSwitch}
            />
            <Pad
              name={"Electric Guitar"}
              sound={electricGuitar}
              logo={electricGuitarLogo}
              padState={electricGuitarIsOn}
              setPadState={setElectricGuitarIsOn}
              onSwitch={onSwitch}
            />
            <Pad
              name={"Funk"}
              sound={funk}
              logo={funkLogo}
              padState={funkIsOn}
              setPadState={setFunkIsOn}
              onSwitch={onSwitch}
            />
          </div>
          <div className={classes.padsRow}>
            <Pad
              name={"Groove"}
              sound={groove}
              logo={grooveLogo}
              padState={grooveIsOn}
              setPadState={setGrooveIsOn}
              onSwitch={onSwitch}
            />
            <Pad
              name={"Maze Politics"}
              sound={mazePolitics}
              logo={mazePoliticsLogo}
              padState={mazePoliticsIsOn}
              setPadState={setMazePoliticsIsOn}
              onSwitch={onSwitch}
            />
            <Pad
              name={"Synthesizer"}
              sound={synthesizer}
              logo={synthesizerLogo}
              padState={synthesizerIsOn}
              setPadState={setSynthesizerIsOn}
              onSwitch={onSwitch}
            />
          </div>
        </div>
        <div className={classes.toolbarSpaceSaver}></div>
      </div>
      <ToolBar
        onStart={onStart}
        onStop={onStop}
        isPlaying={isPlaying}
        volumeSliderValue={volumeSliderValue}
        onVolumeChange={onVolumeChange}
      />
      {/* </div> */}
    </>
  );
}
