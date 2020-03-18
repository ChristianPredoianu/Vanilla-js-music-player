const volumeRange = document.getElementById('volume-range'),
  volumeUp = document.getElementById('volume-up'),
  image = document.getElementById('image'),
  audio = document.getElementById('audio'),
  trackTitle = document.getElementById('music-title'),
  replay = document.getElementById('replay'),
  previousTrackBtn = document.getElementById('previous-track'),
  playBtn = document.getElementById('play'),
  pauseBtn = document.getElementById('pause'),
  nextTrackBtn = document.getElementById('next-track'),
  shuffleBtn = document.getElementById('shuffle'),
  progressContainer = document.getElementById('progress-container'),
  progress = document.getElementById('progress'),
  timeProgress = document.getElementById('time-progress'),
  totalTrackTime = document.getElementById('total-track-time');

const songs = ['brazilsamba', 'creativeminds', 'dreams', 'energy', 'summer'];

//Keep track of the songs
let songIndex = 0;

//Init the first song
function initSong() {
  audio.src = `music/${songs[songIndex]}.mp3`;
  image.src = `images/${songs[songIndex]}.jpg`;
  trackTitle.textContent = songs[songIndex];
}

//Volume control
function volumeControl() {
  const position = volumeRange.value / volumeRange.max;
  audio.volume = position;
  if (audio.volume === 0) {
    mute.classList.add('muted');
  } else {
    mute.classList.remove('muted');
  }
}

//Repeat song
function repeatTrack() {
  replay.classList.toggle('active-replay');
  if (replay.classList.contains('active-replay')) {
    audio.loop = true;
  } else {
    audio.loop = false;
  }
}
//Previous song
function previousTrack() {
  playPauseHandler();
  songIndex -= 1;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
    initSong();
    audio.play();
  } else {
    initSong();
    audio.play();
  }
}

//Play paus btn handler
function playPauseHandler() {
  image.classList.add('play');
  playBtn.querySelector('.fas').classList.remove('fa-play');
  playBtn.querySelector('.fas').classList.add('fa-pause');
}

//Play song
function playSong() {
  playPauseHandler();
  audio.play();
}

//Pause song
function pauseSong() {
  playBtn.querySelector('.fas').classList.remove('fa-pause');
  playBtn.querySelector('.fas').classList.add('fa-play');
  image.classList.remove('play');
  audio.pause();
}

//Next song
function nextTrack() {
  playPauseHandler();
  songIndex += 1;
  if (songIndex < songs.length) {
    initSong();
    audio.play();
  } else {
    songIndex = 0;
    initSong();
    audio.play();
  }
}

//Random track
function randomTrack() {
  playPauseHandler();
  songIndex = Math.floor(Math.random() * songs.length);
  initSong();
  audio.play();
}

//Update progressbar
function updateProgress(e) {
  const percent = e.offsetX / this.offsetWidth;
  audio.currentTime = percent * audio.duration;
  progress.value = percent / 100;
}

//Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = image.classList.contains('play');
  if (!isPlaying) {
    playSong();
  } else {
    pauseSong();
  }
});

/*The volume range does not work on touch devices without the 
touchend*/

volumeRange.addEventListener('touchend', volumeControl);
volumeRange.addEventListener('click', volumeControl);
nextTrackBtn.addEventListener('click', nextTrack);
previousTrackBtn.addEventListener('click', previousTrack);
replay.addEventListener('click', repeatTrack);
shuffleBtn.addEventListener('click', randomTrack);
progressContainer.addEventListener('click', updateProgress);

audio.addEventListener('loadedmetadata', () => {
  //Display the track:s total duration
  let totalSeconds = parseInt(audio.duration % 60);
  let totalMinutes = parseInt(audio.duration / 60) % 60;

  if (totalSeconds < 10) {
    totalSeconds = '0' + totalSeconds;
    totalTrackTime.textContent = `${totalMinutes}:${totalSeconds}`;
  }
  if (totalMinutes < 10) {
    totalMinutes = '0' + totalMinutes;
    totalTrackTime.textContent = `${totalMinutes}:${totalSeconds}`;
  }
});

audio.addEventListener('timeupdate', e => {
  //Update progressbar depending on progress(time)
  progress.style.width = `0%`;
  const duration = audio.duration;
  const currentTime = audio.currentTime;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  //Check if track ended and go to next track
  if (progressPercent === 100) {
    nextTrack();
  }

  // Update the current time
  let seconds = parseInt(audio.currentTime % 60);
  let minutes = parseInt((audio.currentTime / 60) % 60);
  if (seconds < 10) {
    seconds = '0' + seconds;
    timeProgress.innerHTML = `${minutes}:${seconds}`;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
    timeProgress.innerHTML = `${minutes}:${seconds}`;
  }
});

initSong();
