import React from "react";

const SECONDS_IN_MIN = 60;

const SongDisplay = ({ songData, scrubPosition, setScrubPosition }) => {
  const handleScrubChange = (e) => {
    setScrubPosition(parseInt(e.target.value));
    // Additional logic to handle scrubbing in the song can be added here
  };

  return (
    <div className="flex flex-col space-y-4 pt-10 text-black">
      <div className="text-center p-4">
        <h1 className="text-2xl font-bold overflow-hidden text-ellipsis clamp-2">
          {songData.title}
        </h1>
        <p className="text-gray-400">{songData.artist}</p>
      </div>

      <div className="flex px-8">
        <div className="w-1/6 flex justify-center">
          {Math.floor(scrubPosition / SECONDS_IN_MIN)}:
          {(scrubPosition % SECONDS_IN_MIN).toString().padStart(2, "0")}
        </div>
        <input
          type="range"
          min="0"
          max={songData.duration}
          value={scrubPosition}
          onChange={handleScrubChange}
          className="w-full"
          aria-label="Song Scrubber"
        />
        <div className="w-1/6 flex justify-center">
          {Math.floor(songData.duration / SECONDS_IN_MIN)}:
          {(songData.duration % SECONDS_IN_MIN).toString().padStart(2, "0")}
        </div>
      </div>
      <style jsx>{`
        .clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </div>
  );
};

export default SongDisplay;
