const SpotifyAPIFetch = async (url) => {
    const client_id = '2fc7581c59954ea8aae0e1a420f22956';
    const client_secret = '4c537b2401fa4cbc89a4b1e688b9e90c';
    const spotifyPlaylistID = new URL(url).pathname.split("/").pop();
    const APIFetchURL = "https://api.spotify.com/v1/playlists/" + spotifyPlaylistID + "/tracks";
    let accessToken = null;

    const getArtists = (artistsArray) => {
        const artists = new Array();
        artistsArray.forEach((artist) => {
            artists.push(artist.name);
        })
        return artists;
    }

    const callAPI = fetch('https://accounts.spotify.com/api/token', {
            method: "POST",
            headers: {
                'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=client_credentials",
            json: true
        }).then((res) => {
            if(res.ok && res.status === 200) {
                return res.json();
            } else {
                throw Error("Authorization Error");
            }
        }).then((data) => {
            let songList = [];
            let artistList = [];
            accessToken = data.access_token;
            return fetch(APIFetchURL, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + accessToken
                }
            }).then((res) => {
                if(!res.ok || res.status !== 200) {
                    throw Error("API call failed.");
                }
                return res.json();
            }).then((data) => {
                data.items.forEach((item) => {
                    songList.push(item.track.name);
                    artistList.push(getArtists(item.track.artists));
                })
                // console.log("For loop complete");
                // console.log("About to return API data");
                return [songList, artistList];
            }).catch((error) => {
                console.log(error.message);
            })
        }).catch((error) => {
            console.log(error.message);
        });

    // const callSpotifyAPI = () => {
    //     let songList = new Array();
    //     let artistList = new Array();
    //     fetch('https://accounts.spotify.com/api/token', {
    //         method: "POST",
    //         headers: {
    //             'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         body: "grant_type=client_credentials",
    //         json: true
    //     }).then((res) => {
    //         if(res.ok && res.status === 200) {
    //             return res.json();
    //         } else {
    //             throw Error("Authorization Error");
    //         }
    //     }).then((data) => {
    //         accessToken = data.access_token;
    //         fetch(APIFetchURL, {
    //             method: "GET",
    //             headers: {
    //                 "Authorization": "Bearer " + accessToken
    //             }
    //         }).then((res) => {
    //             if(!res.ok || res.status !== 200) {
    //                 throw Error("API call failed.");
    //             }
    //             return res.json();
    //         }).then((data) => {
    //             data.items.forEach((item) => {
    //                 songList.push(item.track.name);
    //                 artistList.push(getArtists(item.track.artists));
    //             });
    //         }).then(() => {
    //             return [songList, artistList];
    //         }).catch((error) => {
    //             console.log(error.message);
    //         })
    //     }).catch((error) => {
    //         console.log(error.message);
    //     })
    // }

    const [songList, artistList] = await callAPI;
    // console.log("API data should've been received");
    // console.log(songList[0]);
    return [songList, artistList];
}

export default SpotifyAPIFetch;