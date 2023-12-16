// Contact Info Modal
var contactinfoButton = document.querySelector('#contact');
var modalBg = document.querySelector('.modal-background');
var modal = document.querySelector('.modal');

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


// obtains access token
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

// gets artist information and top tracks based on user input
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
// gets artist from spotify api
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
//function to get top trakcs from artist
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
//function to display result 
function displayResults(artist, songs) {
    var spotifyResults = document.getElementById('results-spotify');
    spotifyResults.innerHTML = 'Spotify';

    if (songs.length > 0) {
        var list = document.createElement('ul');


        songs.forEach(song => {
            var listItem = document.createElement('li');
            listItem.textContent = song.name;
            list.appendChild(listItem);
        });

        spotifyResults.appendChild(list);
    } else {
        spotifyResults.innerHTML += '<p>No songs found for this artist.</p>';
    }
}

// hold deezer api key
var deezerApiKey = '653551';

// Function to get the top 10 songs of an artist
async function getTopSongs(artistName) {
    if (artistName === undefined || artistName === null || artistName.length === 0) {
        artistName = document.querySelector('#artist-input').value;
    }
    console.log('got the artist name and it is', artistName);
  // Get artist information
  var artistInfo = await searchDeezerArtist(artistName);

//   console.log('artist  info', artistInfo);

  if (!artistInfo || artistInfo.length === 0) {
    showError(`Artist "${artistName}" not found`);
    return;
  }
  var artistId = artistInfo.id;

  // Get top tracks of the artist
  var topTracks = await getDeezerTracks(artistId);

  if (!topTracks || topTracks.length === 0) {
    showError(`No top tracks found for artist "${artistName}"`);
    return;
  }

  // Display the top 10 tracks on the page
  displayDeezerResults(artistName, topTracks);
}
// looks for artist on deezer
async function searchDeezerArtist(artistName) {
    var url = `https://api.deezer.com/search?q=artist:"${artistName}"&api_key=${deezerApiKey}n`;
    console.log('url', url);
    try {
      var response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Deezer artist: ${response.status} - ${response.statusText}`);
      }
  
      var data = await response.json();

    //   console.log('got the artist data', data.data[0].artist);
      return data.data[0].artist;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  // Function to get the top tracks of an artist
  async function getDeezerTracks(artistId) {
    console.log('WOO!');
    try {
      var response = await fetch(
        `https://api.deezer.com/artist/${artistId}/top?limit=10&api_key=${deezerApiKey}`
      );
      
      if (!response.ok) {
          throw new Error(`Failed to fetch Deezer top tracks: ${response.status} - ${response.statusText}`);
        }
        
        var data = await response.json();
      return data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

// Function to display the top tracks on the page
function displayDeezerResults(artistName, topTracks) {
  var deezerResults = document.getElementById('results-deezer');
  deezerResults.innerHTML = `<h2>Top 10 tracks for ${artistName}:</h2>`;
  
  var deezerTL = document.createElement('ul');
  topTracks.forEach((track, index) => {
    var li = document.createElement('li');
    li.textContent = `${index + 1}. ${track.title}`;
    deezerTL.appendChild(li);
  });

  deezerResults.appendChild(deezerTL);
}

// Dropdowns in navbar

var $dropdowns = getAll('.navbar-item.has-dropdown:not(.is-hoverable)');

if ($dropdowns.length > 0) {
  $dropdowns.forEach(function ($el) {
    $el.addEventListener('click', function (event) {
      event.stopPropagation();
      $el.classList.toggle('is-active');
    });
  });

  document.addEventListener('click', function (event) {
    closeDropdowns();
  });
}

function closeDropdowns() {
  $dropdowns.forEach(function ($el) {
    $el.classList.remove('is-active');
  });
}

// Close dropdowns if ESC pressed
document.addEventListener('keydown', function (event) {
  var e = event || window.event;
  if (e.keyCode === 27) {
    closeDropdowns();
  }
});

// Toggles

var $burgers = getAll('.burger');

if ($burgers.length > 0) {
  $burgers.forEach(function ($el) {
    $el.addEventListener('click', function () {
      var target = $el.dataset.target;
      var $target = document.getElementById(target);
      $el.classList.toggle('is-active');
      $target.classList.toggle('navbar-burger ');
    });
  });
}

// Functions

function getAll(selector) {
  return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
}
;
