import {useState} from 'react';
import {Play} from 'lucide-react';

const films = {
  community: {
    src: '/videos/community-film.mp4',
    poster: '/videos/community-poster.jpg',
    title: 'Education & care — community film',
    label: 'COMMUNITY FILM',
    duration: '01:43',
    width: 720,
    height: 1280,
  },
  music: {
    src: '/videos/music-film.mp4',
    poster: '/videos/music-poster.jpg',
    title: 'Beyond the notes — music film',
    label: 'MUSIC FILM',
    duration: '03:01',
    width: 1270,
    height: 720,
  },
};

export function ProjectVideo({projectId}: {projectId: keyof typeof films}) {
  const film = films[projectId];
  const [failed, setFailed] = useState(false);

  return <figure className={`project-film project-film--${projectId}`}>
    <video
      key={film.src}
      controls
      playsInline
      preload="none"
      poster={film.poster}
      width={film.width}
      height={film.height}
      aria-label={film.title}
      onError={() => setFailed(true)}
      onPlay={event => {
        setFailed(false);
        const playing = event.currentTarget;
        document.querySelectorAll('video').forEach(video => {
          if (video !== playing) video.pause();
        });
      }}
    >
      <source src={film.src} type="video/mp4" onError={() => setFailed(true)}/>
      <a href={film.src}>Open {film.label.toLowerCase()}</a>
    </video>
    <figcaption><span><Play size={12} aria-hidden="true"/>{film.label}</span><span>{film.duration}</span></figcaption>
    {failed && <p className="film-error" role="status">The video couldn’t load. <a href={film.src}>Open the video directly</a>.</p>}
  </figure>;
}
