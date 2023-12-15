var artist = document.getElementById("seBar");

function saveArtist() {
    var recentArt = artist.value;
    localStorage.setItem(recentArt);
}

function putUp()