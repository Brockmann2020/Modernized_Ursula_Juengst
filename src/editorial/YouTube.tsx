'use client';

import { useState } from 'react';

import type { Locale } from '../site/routes';
import { VideoFrame } from './Editorial.styles';

export function YouTube({ videoId, title, locale }: { videoId: string; title: string; locale: Locale }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <VideoFrame>
      {loaded ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setLoaded(true)}>
          <span aria-hidden="true">▶ </span>
          {locale === 'de' ? 'YouTube-Video laden' : 'Load YouTube video'}
        </button>
      )}
    </VideoFrame>
  );
}
