import { Button } from "react-bootstrap";
import SpotifyAPIFetch from "./SpotifyAPIFetch";
import YouTubeAPIFetch from "./YouTubeAPIFetch";
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from "react";
import TrackList from "./TrackList";

const Home = () => {
    let videoIDList = [];
    const [tracks, setTracks] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [numberOfSongsDownloaded, setNumberOfSongsDownloaded] = useState(0);
    const [playlistLength, setPlaylistLength] = useState(0);
    const [downloadComplete, setDownloadComplete] = useState(false);
    let songList, artistList = [];
    let trackList = [];
    const backendPostUrl = 'http://localhost:3001/backend/link';
    const backendGetUrl = 'http://localhost:3001/backend'

    const viewPlaylistButtonClick = async () => {
        songList = [];
        artistList = [];
        [songList, artistList] = await SpotifyAPIFetch(userInput);
        trackList = createTrackList();
        setTracks(trackList);
    }

    const downloadButtonClick = async () => {
        await viewPlaylistButtonClick();
        videoIDList = await YouTubeAPIFetch(songList, artistList);
        const backendPackage = [videoIDList, songList, artistList];
        setIsDownloading(true);
        setPlaylistLength(videoIDList.length);
        setDownloadComplete(false);
        fetch(backendPostUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(backendPackage)
        });
        // setNumberOfSongsDownloaded(await backendGetRequest());
        const intervalID = setInterval(async () => {
            const numSongsDownloaded = await backendGetRequest();
            setNumberOfSongsDownloaded(numSongsDownloaded);
            if(numSongsDownloaded >= videoIDList.length) {
                setIsDownloading(false);
                setDownloadComplete(true);
                clearInterval(intervalID);
            }
        }, 1000);
    }

    const backendGetRequest = async () => {
        return await fetch(backendGetUrl)
        .then((res) => {
            if(!res.ok) {
                throw Error("Backend GET request failed.")
            }
            return res.json();
        }).then((data) => {
            return data.numDownloaded;
        }).catch((error) => {
            console.log(error.message);
        })
    }

    const createTrackList = () => {
        let trackList = [];
        for(let i=0; i < songList.length; i++) {
            let trackNameAndArtist = songList[i] + " - ";
            for(let j=0; j < artistList[i].length; j++) {
              trackNameAndArtist = trackNameAndArtist + artistList[i][j];
              if(j !== artistList[i].length - 1) {
                trackNameAndArtist = trackNameAndArtist + ', ';
              }
            }
            trackList.push(trackNameAndArtist);
        }
        return trackList;
    }
    
    return (
        <div className="home-page">
            <div className="m-5">
                <h1>Music Downloader</h1>
            </div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="input-section col-lg-10 border border-3 border-primary rounded-5 my-4 p-4">
                        <h5>Enter Spotify Playlist Link</h5>
                        <form action="">
                            <input type="text" required value={userInput} onChange={(e) => (setUserInput(e.target.value))} className="form-control"/>
                            <div className="form-text">Enter link here</div>
                        </form>
                    </div>
                </div>
                <Button onClick={viewPlaylistButtonClick} className="mx-3 my-3">View Playlist</Button>
                <Button onClick={downloadButtonClick} className="mx-3 my-3">Download Playlist</Button>
                <div>
                    {isDownloading && <h5 className="text-primary">Downloading... {numberOfSongsDownloaded}/{playlistLength} Complete</h5>}
                    {downloadComplete && <h5 className="text-success">Download complete - {numberOfSongsDownloaded}/{playlistLength} Complete</h5>}
                </div>
                <div className="row justify-content-center">
                    <div className="song-list-section col-lg-9 border border-3 border-secondary rounded-5 my-4 p-4">
                        <h4>Playlist Items</h4>
                        {!tracks && <h5>Empty</h5>}
                        {tracks && <TrackList trackList={tracks}/>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;