import { loadMedia } from './lazyload';

export function playVideo(entry) {
  const elem = entry.target;
  elem.pause();
  elem.currentTime = 0;

  if (entry.isIntersecting) {
    if (!elem.src) {
      loadMedia(elem);
    }
    
    window.setTimeout(() => {
      elem.play();
    }, 200);  
  }
}

export function playVideoObserver(entries) {
  entries.forEach((entry) => {
    playVideo(entry);
  });
}

export default function () {
  const videos = document.querySelectorAll('video[data-autoplay]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(playVideoObserver);
    videos.forEach(video => observer.observe(video));
  }
}
