import { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaRandom,
  FaRedo,
} from "react-icons/fa";
import range from "lodash/range";
import SongDisplay from "./SongDisplay";
import SongList from "./SongList";

/**
 *
 * @param {*} songList – expects array of json objects representing songs, with artist, title, year and duration
 * @returns
 */
const MusicPlayer = (props) => {
  const { songList } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [scrubPosition, setScrubPosition] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const currentSong = songList[currentSongIndex];
  const [shuffleHistory, setShuffleHistory] = useState([]);

  const handlePlayPauseClick = () => {
    setIsPlaying((prevState) => !prevState);
  };

  useEffect(() => {
    let interval = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setScrubPosition((prevPosition) =>
          Math.min(prevPosition + 1, currentSong.duration)
        );
      }, 1000);
    } else if (!isPlaying && interval) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (scrubPosition >= currentSong.duration && isPlaying) {
      handleNextClick(); // Move to the next song when the current song ends
    }
  }, [scrubPosition, handleNextClick, currentSong, isPlaying]);

  const handleNextClick = useCallback(() => {
    setScrubPosition(0);
    if (isShuffle) {
      setShuffleHistory((prevState) => prevState.concat([currentSongIndex]));
      setCurrentSongIndex(getNextShuffleIndex(shuffleHistory, songList.length));
    } else if (!isRepeat) {
      setCurrentSongIndex((prevState) => (prevState + 1) % songList.length);
    }
  }, [
    setScrubPosition,
    setShuffleHistory,
    setCurrentSongIndex,
    currentSongIndex,
    shuffleHistory,
    songList,
    isRepeat,
  ]);

  const onPreviousSong = useCallback(() => {
    if (isShuffle) {
      // if shuffle queue is exhausted, do nothing. Else, return to last song
      if (shuffleHistory.length) {
        setCurrentSongIndex(shuffleHistory[shuffleHistory.length - 1]);
        setShuffleHistory((prevState) => prevState.slice(0, -1));
      }
    } else if (!isRepeat && currentSongIndex > 0) {
      setCurrentSongIndex((prevState) => prevState - 1);
    }
  }, [
    isShuffle,
    currentSongIndex,
    isRepeat,
    shuffleHistory,
    setCurrentSongIndex,
    setShuffleHistory,
  ]);

  const handlePrevClick = () => {
    if (scrubPosition === 0) {
      onPreviousSong();
    }
    setScrubPosition(0);
  };

  const handleShuffleClick = () => {
    setIsShuffle(!isShuffle);
    setShuffleHistory([]);
    // can't have both at once
    setIsRepeat(false);
  };

  const handleRepeatClick = () => {
    setIsRepeat(!isRepeat);
    // can't have both at once
    setIsShuffle(false);
    setShuffleHistory([]);
  };

  const handleSelectSong = (index) => {
    setScrubPosition(0);
    setCurrentSongIndex(index);
  };

  return (
    <div>
      <SongList
        songs={songList}
        currentSongIndex={currentSongIndex}
        onSongSelect={handleSelectSong}
      />
      <hr />
      <div className="h-[40vh] max-w-[800px] m-auto">
        <SongDisplay
          songData={currentSong}
          scrubPosition={scrubPosition}
          setScrubPosition={setScrubPosition}
        />
        <div className="flex items-center justify-center space-x-4 py-8 text-5xl text-gray-200 ">
          <button
            onClick={handlePrevClick}
            className="hover:drop-shadow-xl active:text-gray-400"
            aria-label="Previous Song"
          >
            <FaBackward />
          </button>
          <button
            onClick={handlePlayPauseClick}
            className="hover:drop-shadow-xl active:text-gray-400"
            aria-label={isPlaying ? "Pause Song" : "Play Song"}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button
            onClick={handleNextClick}
            className="hover:drop-shadow-xl active:text-gray-400"
            aria-label="Next Song"
          >
            <FaForward />
          </button>
          <button
            onClick={handleShuffleClick}
            aria-label="Shuffle Song"
            className={`hover:drop-shadow-xl active:text-blue-500 ${
              isShuffle ? "text-blue-500" : ""
            }`}
          >
            <FaRandom />
          </button>
          <button
            onClick={handleRepeatClick}
            aria-label="Repeat Song"
            className={`hover:drop-shadow-xl active:text-blue-500 ${
              isRepeat ? "text-blue-500" : ""
            }`}
          >
            <FaRedo />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;

const getNextShuffleIndex = (shuffleHistory, songListSize) => {
  const nextIndexOptions = range(songListSize).filter(
    (index) => !shuffleHistory.includes(index)
  );
  return nextIndexOptions[Math.floor(nextIndexOptions.length * Math.random())];
};
