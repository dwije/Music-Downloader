const YouTubeAPIFetch = async (songList, artistList) => {
    const api_key = "AIzaSyC4MfsDUgOz2bAP1u4ksjf23R6EKRBgcWc";
    // let apiRequestURL = "https://youtube.googleapis.com/youtube/v3/search?q=" + "Circles+" + "Post+Malone" + "&key=" + api_key;
    let videoIDList = [];

/*  OLD CODE - DELETE LATER
    for(let i=0; i < songList.length; i++) {
        const trackNameURL = songList[i].replace(/ /g, "+") + "+";
        let artistNamesURL;
        artistList[i].forEach((artist) => {
            artistNamesURL += artist.replace(/ /g, "+") + "+";
        });
        const apiRequestURL = "https://youtube.googleapis.com/youtube/v3/search?q=" + trackNameURL + artistNamesURL + "&key=" + api_key;
        callYouTubeAPI(apiRequestURL);
    });
*/
    // OLD CODE - DELETE LATER
    // const callYouTubeAPI = 
    // fetch(apiRequestURL).then((res) => {
    //     // console.log(res);
    //     return res.json();
    // }).then((data) => {
    //     // console.log(data);
    //     let videoID = data.items[0].id.videoId;
    //     return videoID;
    // });

    // This is modified code for just 5 API calls so I don't waste API quota

    const removeBadCharacters = (index) => {
        let urlSafeSongName = '';
        urlSafeSongName = songList[index];
        urlSafeSongName = urlSafeSongName.replace('!', "%21");
        urlSafeSongName = urlSafeSongName.replace('"', "%22");
        urlSafeSongName = urlSafeSongName.replace('#', "%23");
        urlSafeSongName = urlSafeSongName.replace('$', "%24");
        urlSafeSongName = urlSafeSongName.replace('%', "%25");
        urlSafeSongName = urlSafeSongName.replace('&', "%26");
        urlSafeSongName = urlSafeSongName.replace("'", "%27");
        urlSafeSongName = urlSafeSongName.replace('+', "%2B");
        urlSafeSongName = urlSafeSongName.replace('/', "%2C");
        urlSafeSongName = urlSafeSongName.replace(':', "%3A");
        urlSafeSongName = urlSafeSongName.replace(';', "%3B");
        urlSafeSongName = urlSafeSongName.replace('=', "%3D");
        urlSafeSongName = urlSafeSongName.replace('?', "%3F");
        urlSafeSongName = urlSafeSongName.replace('@', "%40");
        urlSafeSongName = urlSafeSongName.replace('[', "%5B");
        urlSafeSongName = urlSafeSongName.replace('\\', "%5C");
        urlSafeSongName = urlSafeSongName.replace(']', "%5D");
        urlSafeSongName = urlSafeSongName.replace('^', "%5E");
        urlSafeSongName = urlSafeSongName.replace('{', "%7B");
        urlSafeSongName = urlSafeSongName.replace('|', "%7C");
        urlSafeSongName = urlSafeSongName.replace('}', "%7D");
        return urlSafeSongName;
    }

    for(let i=0; i < 5; i++) {
        const urlSafeSongName = removeBadCharacters(i);
        const trackNameURL = urlSafeSongName.replace(/ /g, "+") + "+";
        let artistNamesURL = '';
        artistList[i].forEach((artist) => {
            artistNamesURL += artist.replace(/ /g, "+") + "+";
        });
        const apiRequestURL = "https://youtube.googleapis.com/youtube/v3/search?q=" + trackNameURL + artistNamesURL + "official+audio&key=" + api_key;
        await fetch(apiRequestURL).then((res) => {
            return res.json();
        }).then((data) => {
            videoIDList.push(data.items[0].id.videoId);
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return videoIDList;
}
 
export default YouTubeAPIFetch;