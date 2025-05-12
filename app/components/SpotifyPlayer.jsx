// app/components/SpotifyPlayer.jsx
'use client';

import React, { useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/material';

export default function SpotifyPlayer() {
  const theme = useTheme();                                
  const spotifyTheme = useRef(                             
    theme.palette.mode === 'light' ? 'light' : 'dark'
  );
  const holderRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    let controllerInstance = null;

    const createFixedPlayer = (api) => {
      if (!holderRef.current || controllerRef.current) return;

      const options = {
        uri: 'spotify:playlist:37i9dQZF1E4Dmek9iS3tyk',
        width: '100%',
        height: 80,
        theme: spotifyTheme.current,                     
      };

      try {
        api.createController(holderRef.current, options, (ctrl) => {
          if (ctrl) {
            controllerRef.current = ctrl;
            controllerInstance = ctrl;
          }
        });
      } catch (e) {
        console.error('SpotifyPlayer error:', e);
      }
    };

    if (window.SpotifyIframeApi) {
      createFixedPlayer(window.SpotifyIframeApi);
    } else {
      const script = document.createElement('script');
      script.src = 'https://open.spotify.com/embed/iframe-api/v1';
      script.async = true;
      document.body.appendChild(script);
      window.onSpotifyIframeApiReady = (api) => createFixedPlayer(api);
    }

    return () => {
      const toDestroy = controllerInstance || controllerRef.current;
      if (toDestroy) {
        try { toDestroy.destroy(); } catch {}
        if (controllerRef.current === toDestroy) controllerRef.current = null;
      }
      delete window.onSpotifyIframeApiReady;
    };
  }, []);  // executa só no mount

  return (
    <Box
      suppressHydrationWarning
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '80px',
        overflow: 'hidden',
        zIndex: 8,
        display: 'flex',
      }}
    >
      <Box ref={holderRef} sx={{ flex: 1 }} />
    </Box>
  );
}
