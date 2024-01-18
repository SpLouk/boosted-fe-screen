import MusicPlayer from "../components/MusicPlayer";

const songs = require("./songlist.json");

// songs contains an array of objects, each with a title, artist, duration in seconds. Refer to README for more details.

/*
{
    "title": "#40",
    "artist": "Dave Matthews",
    "duration": 35
}, 
*/

export default function Home() {
  return <MusicPlayer songList={songs.songs} />;
}
