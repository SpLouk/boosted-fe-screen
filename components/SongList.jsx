import React from "react";

const SongList = ({ songs, onSongSelect, currentSongIndex }) => {
  return (
    <div className="p-4 h-[60vh] overflow-y-auto">
      <ul>
        {songs.map((song, index) => (
          <li
            key={index}
            className={`cursor-pointer p-2 rounded ${
              index === currentSongIndex ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
            onClick={() => onSongSelect(index)}
          >
            {song.title} - {song.artist}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongList;
