document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById('video');
    const videoSource = document.getElementById('video-source');
    const subtitlesTrack = document.getElementById('subtitles-track');
    const botonReproducirPausar = document.getElementById('play-pause');
    const botonSilencio = document.getElementById('mute');
    const controlVolumen = document.getElementById('volume');
    const botonVolumen = document.getElementById('volume-button');
    const controlVelocidad = document.getElementById('speed-button');
    const speedOptions = document.getElementById('speed-options');
    const barraDesplazamiento = document.getElementById('seek-bar');
    const botonPantallaCompleta = document.getElementById('fullscreen');
    const botonSubtitulos = document.getElementById('subtitles-button');
    const botonCaptura = document.getElementById('capture');
    const canvas = document.getElementById('canvas');
    const controlTamaño = document.getElementById('size-button');
    const sizeOptions = document.getElementById('size-options');
    const listaVideos = document.getElementById('video-list');
    const videoItems = document.querySelectorAll('.video-item');
    const botonPrevVideo = document.getElementById('prev-video');
    const botonNextVideo = document.getElementById('next-video');
    let currentVideoIndex = 0;

    if (!video || !videoSource || !subtitlesTrack || !botonReproducirPausar || !botonSilencio || !controlVolumen || !botonVolumen || !controlVelocidad || !speedOptions || !barraDesplazamiento || !botonPantallaCompleta || !botonSubtitulos || !botonCaptura || !canvas || !controlTamaño || !sizeOptions || !listaVideos || !botonPrevVideo || !botonNextVideo) {
        console.error('Algunos elementos del DOM no se encontraron.');
        return;
    }

    // Funcionalidad de reproducir/pausar
    botonReproducirPausar.addEventListener('click', function () {
        if (video.paused) {
            video.play();
            botonReproducirPausar.textContent = '❚❚';
        } else {
            video.pause();
            botonReproducirPausar.textContent = '►';
        }
    });

    // Funcionalidad de silencio
    botonSilencio.addEventListener('click', function () {
        video.muted = !video.muted;
        botonSilencio.textContent = video.muted ? '🔇' : '🔊';
    });

    // Funcionalidad de volumen
    botonVolumen.addEventListener('click', function () {
        controlVolumen.style.display = controlVolumen.style.display === 'block' ? 'none' : 'block';
    });

    controlVolumen.addEventListener('input', function () {
        const volume = controlVolumen.value / 100;
        video.volume = volume;
        controlVolumen.style.background = `linear-gradient(to right, #FF6347 ${volume * 100}%, #8B0000 ${100 - volume * 100}%)`;
    });

    controlVolumen.addEventListener('change', function () {
        controlVolumen.style.display = 'none';
    });

    // Tooltip para la barra de volumen
    const controlLabel = document.querySelector('.control-label');
    if (controlLabel) {
        const volumeTooltip = document.createElement('div');
        volumeTooltip.classList.add('volume-tooltip');
        volumeTooltip.textContent = 'Volumen';
        controlLabel.appendChild(volumeTooltip);
    }

    // Control de velocidad de reproducción
    controlVelocidad.addEventListener('click', function () {
        speedOptions.style.display = speedOptions.style.display === 'flex' ? 'none' : 'flex';
    });

    speedOptions.addEventListener('click', function (event) {
        if (event.target.classList.contains('speed-option')) {
            video.playbackRate = event.target.dataset.speed;
            speedOptions.style.display = 'none';
        }
    });

    // Funcionalidad de la barra de desplazamiento
    video.addEventListener('timeupdate', function () {
        const value = (100 / video.duration) * video.currentTime;
        barraDesplazamiento.value = value;
    });

    barraDesplazamiento.addEventListener('input', function () {
        const time = (barraDesplazamiento.value * video.duration) / 100;
        video.currentTime = time;
    });

    // Pantalla completa
    botonPantallaCompleta.addEventListener('click', function () {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) { // Firefox
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) { // Chrome and Safari
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { // IE/Edge
            video.msRequestFullscreen();
        }
    });

    // Subtítulos
    botonSubtitulos.addEventListener('click', function () {
        const track = video.textTracks[0];
        if (track.mode === 'showing') {
            track.mode = 'hidden';
            botonSubtitulos.textContent = 'Mostrar Subtítulos';
        } else {
            track.mode = 'showing';
            botonSubtitulos.textContent = 'Ocultar Subtítulos';
        }
    });

    // Captura de pantalla
    botonCaptura.addEventListener('click', function () {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'captura.png';
        link.click();
    });

    // Cambio de tamaño de video
    controlTamaño.addEventListener('click', function () {
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

    // Cambio de video en la lista de reproducción
    videoItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            const src = item.dataset.src;
            const subtitles = item.dataset.subtitles;
            videoSource.src = src;
            subtitlesTrack.src = subtitles;
            video.load();
            video.play();
            currentVideoIndex = index;
            videoItems.forEach((i) => i.removeAttribute('selected'));
            item.setAttribute('selected', '');
        });
    });

    // Video anterior y siguiente
    botonPrevVideo.addEventListener('click', function () {
        currentVideoIndex = (currentVideoIndex - 1 + videoItems.length) % videoItems.length;
        videoItems[currentVideoIndex].click();
    });

    botonNextVideo.addEventListener('click', function () {
        currentVideoIndex = (currentVideoIndex + 1) % videoItems.length;
        videoItems[currentVideoIndex].click();
    });

    // Cerrar la barra de volumen al hacer clic en otro lugar
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.control-label') && controlVolumen.style.display === 'block') {
            controlVolumen.style.display = 'none';
        }
    });
});
