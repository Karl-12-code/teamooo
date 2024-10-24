const content = document.getElementById('content');

// Función para hacer que el video sea interactivo y arrastrable
function makeVideoInteractive(videoElement) {
    videoElement.addEventListener('click', () => {
        videoElement.style.transform = 'scale(1.2) rotate(0deg)';
        setTimeout(() => {
            videoElement.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
    });

    // Mover el video a una posición aleatoria
    moveVideo(videoElement);
    
    // Hacer el video arrastrable
    let isDragging = false;
    let offsetX, offsetY;

    videoElement.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - videoElement.getBoundingClientRect().left;
        offsetY = touch.clientY - videoElement.getBoundingClientRect().top;
    });

    videoElement.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const touch = e.touches[0];
            videoElement.style.left = `${touch.clientX - offsetX}px`;
            videoElement.style.top = `${touch.clientY - offsetY}px`;
        }
    });

    videoElement.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Mover video a una posición aleatoria en un intervalo
    moveVideo(videoElement);
}

// Mover video a una posición aleatoria en un intervalo
function moveVideo(videoElement) {
    const move = () => {
        videoElement.style.left = `${Math.random() * (window.innerWidth - videoElement.offsetWidth)}px`;
        videoElement.style.top = `${Math.random() * (window.innerHeight - videoElement.offsetHeight)}px`;
    };

    move(); // Posición inicial
    setInterval(move, 2000); // Cambiar posición cada 2 segundos
}

// Inicializar el primer video
const firstVideo = document.querySelector('.video');
makeVideoInteractive(firstVideo);

// Ajustar la posición de los videos al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    const videos = document.querySelectorAll('.video');
    videos.forEach(video => {
        video.style.left = `${Math.random() * (window.innerWidth - video.offsetWidth)}px`;
        video.style.top = `${Math.random() * (window.innerHeight - video.offsetHeight)}px`;
    });
});

// Función para manejar el play de las canciones
const songs = [
    'https://www.dropbox.com/scl/fi/lmhj1qgsjbzbda5rqh6t5/cari-o.mp3?rlkey=jo0iv26r0llxol61etmy5h05u&dl=1', // Cariño
    'https://www.dropbox.com/scl/fi/k9lxl3029vreho66fkhpu/te_regalo.mp3?rlkey=nd0ugcsjar5maddb5ilugu5do&dl=1', // Te Regalo
    'https://www.dropbox.com/scl/fi/3acaejwh3hvh2xf5dg5vm/lo_que_siento.mp3?rlkey=58gg1g6i7heeg05xgs4bgrhx7&dl=1', // Lo Que Siento
    'https://www.dropbox.com/scl/fi/f45g0vjvg6xcdhbaqu7a3/lover_is_a_day.mp3?rlkey=v8c33oobpq6rhzxtzgg3bwf2l&dl=1', // Lover Is a Day
    'https://www.dropbox.com/scl/fi/1uxdo8hvs1v2lf17wff5c/amor_viejo.mp3?rlkey=1rjewrqow0ft9i1k6dv6jf3yt&dl=1', // Amor Viejo
    'https://www.dropbox.com/scl/fi/vk2hsz1wedgsru6xlwg7s/24_7.mp3?rlkey=yjsd5o5u9aos3q85yqzll2mxo&st=6s4tfdsi&dl=1' // 24:7
];

let currentAudio = null; // Variable para almacenar la canción actualmente reproducida

document.querySelectorAll('.play-button').forEach((button, index) => {
    button.addEventListener('click', () => {
        const song = document.querySelectorAll('.song')[index];

        // Si hay una canción actualmente en reproducción
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0; // Reiniciar el tiempo de la canción
        }

        // Cargar la nueva canción
        currentAudio = new Audio(songs[index]);

        // Manejo de errores
        currentAudio.onerror = () => {
            console.error(`Error al cargar el audio: ${songs[index]}`);
        };

        // Intentar reproducir la nueva canción
        currentAudio.play().catch(error => {
            console.error("Error al intentar reproducir:", error);
        });

        // Actualizar el tiempo de la canción
        const timeElement = song.querySelector('.time');
        let currentTime = 0;

        const updateTime = () => {
            currentTime += 1;
            timeElement.textContent = formatTime(currentTime);
        };

        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        };

        const interval = setInterval(updateTime, 1000);

        // Detener el tiempo cuando la canción se detiene
        currentAudio.addEventListener('ended', () => {
            clearInterval(interval);
            timeElement.textContent = '0:00'; // Reiniciar el tiempo
            currentAudio = null; // Reiniciar la referencia a audio actual
        });
    });
});