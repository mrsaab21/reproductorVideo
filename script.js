document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById('video');
    const videoSource = document.getElementById('video-source');
    const subtitlesTrack = document.getElementById('subtitles-track');
    const playPauseButton = document.getElementById('play-pause');
    const muteButton = document.getElementById('mute');
    const volumeControl = document.getElementById('volume');
    const volumeButton = document.getElementById('volume-button');
    const speedButton = document.getElementById('speed-button');
    const speedOptions = document.getElementById('speed-options');
    const seekBar = document.getElementById('seek-bar');
    const fullscreenButton = document.getElementById('fullscreen');
    const subtitlesButton = document.getElementById('subtitles-button');
    const captureButton = document.getElementById('capture');
    const canvas = document.getElementById('canvas');
    const sizeButton = document.getElementById('size-button');
    const sizeOptions = document.getElementById('size-options');
    const videoList = document.getElementById('video-list');
    const videoItems = document.querySelectorAll('.video-item');
    const prevVideoButton = document.getElementById('prev-video');
    const nextVideoButton = document.getElementById('next-video');
    let currentVideoIndex = 0;

    if (!video || !videoSource || !subtitlesTrack || !playPauseButton || !muteButton || !volumeControl || !volumeButton || !speedButton || !speedOptions || !seekBar || !fullscreenButton || !subtitlesButton || !captureButton || !canvas || !sizeButton || !sizeOptions || !videoList || !prevVideoButton || !nextVideoButton) {
        console.error('Algunos elementos del DOM no se encontraron.');
        return;
    }

    playPauseButton.addEventListener('click', function () {
        if (video.paused) {
            video.play();
            playPauseButton.textContent = '❚❚';
        } else {
            video.pause();
            playPauseButton.textContent = '►';
        }
    });

    muteButton.addEventListener('click', function () {
        video.muted = !video.muted;
        muteButton.textContent = video.muted ? '🔇' : '🔊';
    });

    volumeButton.addEventListener('click', function () {
        volumeControl.style.display = volumeControl.style.display === 'block' ? 'none' : 'block';
    });

    volumeControl.addEventListener('input', function () {
        const volume = volumeControl.value / 100;
        video.volume = volume;
        volumeControl.style.background = `linear-gradient(to right, #FF6347 ${volume * 100}%, #8B0000 ${100 - volume * 100}%)`;
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.control-label') && volumeControl.style.display === 'block') {
            volumeControl.style.display = 'none';
        }
    });

    const controlLabel = document.querySelector('.control-label');
    if (controlLabel) {
        const volumeTooltip = document.createElement('div');
        volumeTooltip.classList.add('volume-tooltip');
        volumeTooltip.textContent = 'Volumen';
        controlLabel.appendChild(volumeTooltip);
    }

    speedButton.addEventListener('click', function () {
        speedOptions.style.display = speedOptions.style.display === 'flex' ? 'none' : 'flex';
    });

    speedOptions.addEventListener('click', function (event) {
        if (event.target.classList.contains('speed-option')) {
            video.playbackRate = event.target.dataset.speed;
            speedOptions.style.display = 'none';
        }
    });

    video.addEventListener('timeupdate', function () {
        const value = (100 / video.duration) * video.currentTime;
        seekBar.value = value;
    });

    seekBar.addEventListener('input', function () {
        const time = (seekBar.value * video.duration) / 100;
        video.currentTime = time;
    });

    fullscreenButton.addEventListener('click', function () {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
    });

    subtitlesButton.addEventListener('click', function () {
        const track = video.textTracks[0];
        if (track.mode === 'showing') {
            track.mode = 'hidden';
            subtitlesButton.textContent = 'Mostrar Subtítulos';
        } else {
            track.mode = 'showing';
            subtitlesButton.textContent = 'Ocultar Subtítulos';
        }
    });

    captureButton.addEventListener('click', function () {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        const currentTime = Math.floor(video.currentTime);
        link.download = `${videoSource.src.split('/').pop().split('.')[0]}_${currentTime}.png`;
        link.click();
    });

    sizeButton.addEventListener('click', function () {
        sizeOptions.style.display = sizeOptions.style.display === 'flex' ? 'none' : 'flex';
    });

    sizeOptions.addEventListener('click', function (event) {
        if (event.target.classList.contains('size-option')) {
            const size = event.target.dataset.size.split('x');
            video.width = size[0];
            video.height = size[1];
            sizeOptions.style.display = 'none';
        }
    });

    videoItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            videoSource.src = item.dataset.src;
            subtitlesTrack.src = item.dataset.subtitles;
            video.load();
            video.play();
            currentVideoIndex = index;
            updateVideoListSelection(index);
        });
    });

    prevVideoButton.addEventListener('click', function () {
        currentVideoIndex = (currentVideoIndex - 1 + videoItems.length) % videoItems.length;
        videoItems[currentVideoIndex].click();
    });

    nextVideoButton.addEventListener('click', function () {
        currentVideoIndex = (currentVideoIndex + 1) % videoItems.length;
        videoItems[currentVideoIndex].click();
    });

    function updateVideoListSelection(index) {
        videoItems.forEach((item, i) => {
            item.classList.toggle('selected', i === index);
        });
    }

    updateVideoListSelection(currentVideoIndex);
});
