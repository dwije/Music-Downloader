const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const fs = require('fs');
const ytdl = require('ytdl-core');
const VIDEO_ID_LIST_INDEX = 0;
const SONG_LIST_INDEX = 1;
const ARTIST_LIST_INDEX = 2;

const PORT = process.env.PORT || 3001;
const downloadDir = "./downloaded_songs"
let numberOfSongsDownloaded = 0;

const app = express();
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/backend", (req, res) => {
    res.json({numDownloaded: numberOfSongsDownloaded});
});

app.post("/backend/link", jsonParser, async (req, res) => {
  numberOfSongsDownloaded = 0;
  const frontendPackage = await req.body;
  const videoIDList = await req.body[VIDEO_ID_LIST_INDEX];
  const songList = await req.body[SONG_LIST_INDEX];
  const artistList = req.body[ARTIST_LIST_INDEX];
  youtubeDL(videoIDList, songList, artistList);
});

const youtubeDL = async (videoIDList, songList, artistList) => {
  // videoIDList = ['IOrbP1OqNsg', 'pQV0WEdT_OE', 'MGYJuETPQEg'];
  // songList = ['Enemy', 'Circles', 'Psycho'];
  // artistList = [['Imagine Dragons', 'JID', 'Arcane'], ['Post Malone'], ['Post Malone']];
  if(!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
  }
  for(let i=0; i < videoIDList.length; i++) {
    const url = 'https://www.youtube.com/watch?v=' + videoIDList[i];
    let fileName = songList[i] + " - ";
    for(let j=0; j < artistList[i].length; j++) {
      fileName = fileName + artistList[i][j];
      if(j !== artistList[i].length - 1) {
        fileName = fileName + ', ';
      } else {
        fileName = fileName + '.mp3'
      }
    }
    await new Promise((resolve) => {
      ytdl(url, {filter: 'audioonly'}).pipe(fs.createWriteStream(downloadDir + "/" + fileName)).on('close', () => {
        resolve();
      })
    })
    numberOfSongsDownloaded++;
    console.log(fileName + " downloaded - " + numberOfSongsDownloaded + "/" + videoIDList.length + " completed");
  }
}