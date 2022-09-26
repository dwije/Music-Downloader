const fs = require('fs');
const ytdl = require('ytdl-core');

const youtubeDL = async (videoIDList, songList, artistList) => {
    videoIDList = ['IOrbP1OqNsg', 'pQV0WEdT_OE', 'MGYJuETPQEg'];
    songList = ['Enemy', 'Circles', 'Psycho'];
    artistList = [['Imagine Dragons', 'JID', 'Arcane'], ['Post Malone'], ['Post Malone']];
    let numberOfSongsDownloaded = 0;
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
        ytdl(url, {filter: 'audioonly'}).pipe(fs.createWriteStream(fileName)).on('close', () => {
          resolve();
        })
      })
      numberOfSongsDownloaded++;
      console.log("Song download complete");
    }
}

youtubeDL(null, null, null);