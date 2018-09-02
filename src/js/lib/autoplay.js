export function playVideo(entry) {
  elem.pause();
  elem.currentTime = 0;

  if (entry.isIntersecting) {
    window.setTimeout(() => {
      elem.play();
    }, 2000);  
  }
}

export function playVideoObserver(entries) {
  entries.forEach((entry) => {
    toggleVideoPlay(entry);
  });
}

export default function () {
  const videos = document.querySelectorAll('video[data-autoplay]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(playVideoObserver);
    videos.forEach(video => observer.observe(video));
  }
}
