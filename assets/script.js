// Contact Info Modal
const contactinfoButton = document.querySelector('#contact');
const modalBg = document.querySelector('.modal-background');
const modal = document.querySelector('.modal');

//This opens the modal
contactinfoButton.addEventListener ('click', () => {
    modal.classList.add('is-active');
});

//This allows the modal to be closed
modalBg.addEventListener ('click', () => {
    modal.classList.remove('is-active');
});

// Spotify credentials 
var spotifyClientId = '80508e371ab14e20a938478967167dc8'; // spotify api client id
var clientSecret = '29c778dd0ffe45efa0d991ce88fdb594'; // spotify api client secret

//encodes the client id and client secret for authentication
var credentials = btoa(spotifyClientId + ':' + clientSecret);
var authHeader ='Basic ' + credentials;


//Function to obtain access token
async function spotifyAccessToken() {
    var tokenUrl = 'https://accounts.spotify.com/api/token';
    var response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': authHeader
        },
        body: 'grant_type=client_credentials',
    });
    var data = await response.json();
    return data.access_token;
}

// Function to get artist information and top tracks based on user input
async function spotifyArtistAndSongs() {
    var artistName = document.getElementById('artist-input').value.trim();
    if (!artistName) {
        alert('Please enter an artist name.');
        return;
    }

    try {
        var accessToken = await spotifyAccessToken();
        var artist = await searchForSpotifyArtist(artistName, accessToken);

        if (artist) {
            var songs = await spotifyArtistSongs(artist.id, accessToken);
            displayResults(artist, songs);
        } else {
            alert('Artist not found');
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert('An error occurred. Please try again.');
    }
}

async function searchForSpotifyArtist(artistName, accessToken) {
    var apiUrl = 'https://api.spotify.com/v1/search';
    var parameters = {
        q: artistName,
        type: 'artist',
        limit: 1,
    };

    var response = await fetch(`${apiUrl}?${new URLSearchParams(parameters)}`,{
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    var data = await response.json();
    if (data.artists && data.artists.items.length > 0) {
        return data.artists.items[0];
    } else {
        return null;
    }
}

async function spotifyArtistSongs(artistId, accessToken) {
    var apiUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks`;
    var parameters = {
        country: 'US', 
    };

    var response = await fetch(`${apiUrl}?${new URLSearchParams(parameters)}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    var data = await response.json();

    return data.tracks;
}

function displayResults(artist, songs) {
    var spotifyResultsContainer = document.getElementById('results-spotify');
    spotifyResultsContainer.innerHTML = '';

    if (songs.length > 0) {
        var list = document.createElement('ul');

        songs.forEach(song => {
            var listItem = document.createElement('li');
            listItem.textContent = song.name;
            list.appendChild(listItem);
        });

        spotifyResultsContainer.appendChild(list);
    } else {
        spotifyResultsContainer.innerHTML += '<p>No songs found for this artist.</p>';
    }
}