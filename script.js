document.addEventListener('DOMContentLoaded', function() {
  // Variables for orientation overlay and sections
  const orientationOverlay = document.getElementById('orientation-overlay');
  const mainContent = document.getElementById('main-content');
  const bgMusic = document.getElementById('bg-music');
  const muteToggle = document.getElementById('mute-toggle');
  const sections = document.querySelectorAll('.section');
  let currentSection = 0;
  let isTransitioning = false;
  
  // Song selection elements
  const songForm = document.getElementById('song-form');
  const confirmSongBtn = document.getElementById('confirm-song');
  const snippetBtn = document.getElementById('snippet-btn');
  
  // Orientation Check
  function checkOrientation() {
    return window.innerWidth > window.innerHeight;
  }
  
  function startExperience() {
    orientationOverlay.style.opacity = 0;
    setTimeout(() => {
      orientationOverlay.style.display = 'none';
      mainContent.style.display = 'block';
      activateSection(0);
    }, 1000);
  }
  
  setTimeout(() => {
    if (checkOrientation()) {
      startExperience();
    }
  }, 5000);
  
  window.addEventListener('resize', () => {
    if (checkOrientation() && orientationOverlay.style.display !== 'none') {
      startExperience();
    }
  });
  
  function activateSection(newIndex) {
    if (newIndex < 0 || newIndex >= sections.length || isTransitioning) return;
    isTransitioning = true;
    sections[currentSection].classList.remove('active');
    setTimeout(() => {
      sections[newIndex].classList.add('active');
      currentSection = newIndex;
      setTimeout(() => {
        isTransitioning = false;
      }, 1100);
    }, 50);
  }
  
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isTransitioning) return;
    if (e.deltaY > 0 && currentSection < sections.length - 1) {
      activateSection(currentSection + 1);
    } else if (e.deltaY < 0 && currentSection > 0) {
      activateSection(currentSection - 1);
    }
  }, { passive: false });
  
  let touchStartY = null;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  });
  window.addEventListener('touchmove', (e) => {
    if (!touchStartY) return;
    let touchEndY = e.touches[0].clientY;
    let diffY = touchStartY - touchEndY;
    if (Math.abs(diffY) > 50 && !isTransitioning) {
      if (diffY > 0 && currentSection < sections.length - 1) {
        activateSection(currentSection + 1);
      } else if (diffY < 0 && currentSection > 0) {
        activateSection(currentSection - 1);
      }
      touchStartY = null;
    }
  });
  
  muteToggle.addEventListener('click', () => {
    bgMusic.muted = !bgMusic.muted;
    muteToggle.innerHTML = bgMusic.muted ? "&#128263;" : "&#128264;";
  });
  
  confirmSongBtn.addEventListener('click', () => {
    const selectedSong = document.querySelector('input[name="song"]:checked');
    if (selectedSong) {
      bgMusic.src = selectedSong.value;
      bgMusic.play().catch(e => console.log("Autoplay error:", e));
      activateSection(1);
    } else {
      alert("Please select a song.");
    }
  });
  
  snippetBtn.addEventListener('click', () => {
    const selectedSong = document.querySelector('input[name="song"]:checked');
    const songSrc = selectedSong ? selectedSong.value : "october.mp3";
    const snippetAudio = new Audio(songSrc);
    snippetAudio.volume = 1.0;
    snippetAudio.play();
    const snippetDuration = 10000;
    const fadeDuration = 2000;
    const fadeStart = snippetDuration - fadeDuration;
    let startTime = Date.now();
    const fadeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= fadeStart) {
        let remaining = snippetDuration - elapsed;
        snippetAudio.volume = remaining / fadeDuration;
      }
      if (elapsed >= snippetDuration) {
        snippetAudio.pause();
        snippetAudio.currentTime = 0;
        clearInterval(fadeInterval);
      }
    }, 100);
  });
  
  // Scrolling Gallery Fix
  const gallery = document.querySelector('.letter-gallery .gallery-scroll');
  const images = ['together11.png', 'together12.png', 'together13.png', 'together14.png', 'together15.png']; // Full list

  images.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Gallery image';
    img.className = 'gallery-img'; // Ensure the class is applied for styling
    gallery.appendChild(img);
  });

  function autoScroll() {
    gallery.scrollLeft += 1; // Slower scrolling speed
    if (gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth) {
      gallery.scrollLeft = 0;
    }
    requestAnimationFrame(autoScroll);
  }

  autoScroll();
});