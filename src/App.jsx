import React, { useState, useEffect } from 'react';
import './App.css';
import { InteractiveCard } from './InteractiveCard';
import { CursorTrail } from './CursorTrail';


import mainPfp from './images/download (2).gif';      
import cursorAsset from './images/cur.png';      

import instaIcon from './images/09066md.png';          
import robloxIcon from './images/r.png';         
import discordIcon from './images/ngh.png';         
import githubIcon from './images/gitt.png';         
import tiktokicon from './images/azeaz.png';
import support from './images/kofi.png'
import stop from './song/Drake - 9.mp3';
import view from './images/viewW.svg';
import cover from './images/Views - Drake.jpg';
import bgVideo from './videos/isit.mp4';
import starImg from './videos/star.png';


function App() {
  const [viewCount, setViewCount] = useState(3242);
  const [currentTime, setCurrentTime] = useState(0);
  const maxTime = 128;
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isOverlayClicked, setIsOverlayClicked] = useState(false);
  const [entered, setEntered] = useState(false);
  const [glitching, setGlitching] = useState(false);

 
  const bioText = 'I trust no one, not even myself';
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);


  useEffect(() => {
    if (!entered) return;
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i <= bioText.length) {
        setTypedText(bioText.slice(0, i));
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 70);
    return () => clearInterval(typeInterval);
  }, [entered]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(blinkInterval);
  }, []);

  const [presence, setPresence] = useState({
  username: '0c6a',
  status: 'Listening',
  customStatus: 'Listening',
  avatarUrl: mainPfp,
  avatarDecoration: null,
  badges: [],
  accentColor: null,
  bannerColor: null,
  bio: '',
  activityIcon: '',
  activityName: '',
  activityState: '',
  activityDetails: '',
  isStreaming: false
});

  const DISCORD_USER_ID = '1491137614525370589';
   

  useEffect(() => {
  async function fetchPresence() {
    try {
      const [presenceRes, profileRes] = await Promise.all([
        fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`),
        fetch(`https://dcdn.dstn.to/profile/${DISCORD_USER_ID}?t=${Date.now()}`)
      ]);
      const presenceJson = await presenceRes.json();
      const profileJson = await profileRes.json();
      const data = presenceJson.data;
      const profile = profileJson.user;
      if (!data || !profile) return;

      const discordUser = data.discord_user;
      const status = data.discord_status || 'offline';
      const avatarHash = discordUser.avatar;
      const avatarUrl = avatarHash
        ? `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${avatarHash}.${avatarHash.startsWith('a_') ? 'gif' : 'png'}?size=256`
        : mainPfp;

      const customActivity = data.activities.find(act => act.type === 4);
      let presenceSubtext = customActivity && customActivity.state ? customActivity.state : '';

      const activeGame = data.activities.find(act => act.type !== 4);
      let activityIconUrl = '';
      let activityNameText = '';
      let activityStateText = '';
      let activityDetailsText = '';

      if (activeGame) {
        presenceSubtext = activeGame.type === 1 ? `Streaming ${activeGame.name}` : `Playing ${activeGame.name}`;
        activityNameText = activeGame.name || '';
        activityStateText = activeGame.state || '';
        activityDetailsText = activeGame.details || '';

        const largeImage = activeGame.assets && activeGame.assets.large_image;
        if (largeImage) {
          if (largeImage.startsWith('mp:external/')) {
            const urlPart = largeImage.split('/').slice(2).join('/');
            const slashIndex = urlPart.indexOf('/');
            if (slashIndex !== -1) {
              activityIconUrl = 'https://' + urlPart.slice(slashIndex + 1);
            } else {
              activityIconUrl = largeImage;
            }
          } else if (largeImage.startsWith('spotify:')) {
            activityIconUrl = `https://i.scdn.co/image/${largeImage.replace('spotify:', '')}`;
          } else if (/^\d+$/.test(largeImage)) {
            activityIconUrl = `https://cdn.discordapp.com/app-assets/${activeGame.application_id}/${largeImage}.png`;
          } else {
            activityIconUrl = largeImage;
          }
        }
      } else if (!presenceSubtext) {
        presenceSubtext = status === 'offline' ? 'Offline' : 'Online';
      }

      setPresence({
        username: discordUser.username,
        status,
        customStatus: presenceSubtext,
        avatarUrl,
        avatarDecoration: profile.avatar_decoration_data || null,
        badges: profileJson.badges || [],
        accentColor: profile.accent_color || null,
        bannerColor: profile.banner_color || null,
        bio: profile.bio || '',
        activityIcon: activityIconUrl,
        activityName: activityNameText,
        activityState: activityStateText,
        activityDetails: activityDetailsText,
        isStreaming: activeGame && activeGame.type === 1,
      });
    } catch (err) {
      console.error('Lanyard fetch failed:', err);
    }
  }

  fetchPresence();
  const interval = setInterval(fetchPresence, 15000);
  return () => clearInterval(interval);
}, []);

  useEffect(() => {
  const interval = setInterval(() => {
    setGlitching(true);
    setViewCount(Math.floor(Math.random() * 999999));
    setTimeout(() => setGlitching(false), 150);
  }, 20); // glitch every 2s instead of 50ms
  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const audioElement = document.getElementById('audio');
    if (!isPlaying && isOverlayClicked) {
      if (audioElement) {
        audioElement.volume = 1;
        audioElement.play().catch(err => console.log("Playback held: ", err));
      }
      setIsPlaying(true);
    }

    const interval = setInterval(() => {
      if (audioElement) {
        const elapsedTime = Math.round(audioElement.currentTime);
        setCurrentTime(elapsedTime);
        if (elapsedTime >= maxTime) {
          audioElement.currentTime = 0;
          setCurrentTime(0);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isOverlayClicked, maxTime]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  return (
    <div className='app-container static-dark-canvas'>
      <video className="bg-video" autoPlay muted loop playsInline>
        <source src={bgVideo} type="video/mp4" />
      </video>
      
      <CursorTrail cursorImage={cursorAsset} />

      {showOverlay && (
        <div
          className='overlay'
          onClick={async () => {
            // ios needs perms to get deviceorientation
            if (
              typeof DeviceOrientationEvent !== 'undefined' &&
              typeof DeviceOrientationEvent.requestPermission === 'function'
            ) {
              try {
                await DeviceOrientationEvent.requestPermission();
              } catch (err) {
                console.log('Motion permission error:', err);
              }
            }
            setShowOverlay(false);
            setIsOverlayClicked(true);
            setEntered(true);
          }}
        >
          <span className='click text-shadow-glow'>click :3</span>
        </div>
      )}

      <div 
        className="profile-3d-scene"
        style={{ 
          perspective: "1200px", 
          WebkitPerspective: "1200px",
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d"
        }}
      >
      <div className="profile-stack-wrapper">
      <InteractiveCard className={`lol-profile-card ${entered ? 'entered' : ''}`}>
        
        <div className={`top-corner-traffic-badge anim-fade-in anim-d2 ${entered ? 'anim-active' : ''}`}>
          <img src={view} className='view-icon-svg' alt="views" />
          <span className={glitching ? 'glitch-active' : ''}>{viewCount}</span>
        </div>

        <div className={`hero-identity-section-row anim-y-scale anim-d3 ${entered ? 'anim-active' : ''}`} style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}>
          <div className='avatar-neon-frame-box' style={{ transform: 'translateZ(60px)', transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}>
            
            <img src={mainPfp} className='user-identity-pfp' alt="Avatar" />
            {presence.avatarDecoration && (
              <img 
                src={`https://cdn.discordapp.com/avatar-decoration-presets/${presence.avatarDecoration.asset}.png?size=256`} 
                className="avatar-decoration-overlay" 
                alt="Decoration" 
              />
            )}
          </div>

          <div className="identity-headers-column-block" style={{ transform: 'translateZ(40px)' }}>
            <div className="user-title-badge-row">
              <h1 className='lol-profile-username'>0c6a</h1>
              {presence.badges.length > 0 && (
                <div className="badge-row">
                  {presence.badges.map((badge, i) => (
                    <img 
                      key={i} 
                      src={`https://cdn.discordapp.com/badge-icons/${badge.icon}.png`} 
                      alt={badge.description} 
                      title={badge.description}
                      className="badge-icon"
                    />
                  ))}
                </div>
              )}
            </div>
            <p className="animated-typing-bio-sub">{typedText}<span className={`typewriter-cursor ${showCursor ? 'visible' : ''}`}>|</span></p>
          </div>
        </div>

        <div className={`presence-and-activity-row anim-y-scale anim-d4 ${entered ? 'anim-active' : ''}`} style={{ transform: 'translateZ(25px)' }}>
          <div className="presence-status-sub-card">
            <div className="mini-avatar-status-wrapper">
              <img src={presence.avatarUrl} className="mini-status-avatar-circle" alt="Discord Avatar" />
              {presence.avatarDecoration && (
                <img
                  src={`https://cdn.discordapp.com/avatar-decoration-presets/${presence.avatarDecoration.asset}.png?size=256`}
                  className="avatar-decoration-overlay"
                  alt="Decoration"
                />
              )}
            </div>
            <div className="presence-details-text-fields">
              <div className="presence-headline-row">
                <span className="presence-profile-id">@{presence.username}</span>
              </div>
              <p className="presence-status-subtext-bio">{presence.customStatus}</p>
            </div>
          </div>

          {presence.activityIcon && (
            <div className="rpc-activity-card">
              <img src={presence.activityIcon} className="rpc-activity-icon" alt="Activity" />
              <div className="rpc-activity-text">
                {presence.activityDetails && <span className="rpc-activity-details">{presence.activityDetails}</span>}
                {presence.activityState && <span className="rpc-activity-state">{presence.activityState}</span>}
              </div>
            </div>
          )}
        </div>

        <div className={`lol-integrated-media-player anim-y-scale anim-d5 ${entered ? 'anim-active' : ''}`} style={{ transform: 'translateZ(25px)' }}>
          <div className='media-timeline-slider-track'>
            <div className='media-timeline-progress-fill' style={{ width: `${(currentTime / maxTime) * 100}%` }} />
          </div>
          <a href='https://soundcloud.com/trapdailysounds/glokk40spaz-sg-lul-ki-stop-playin-prod-by-khroam' target='_blank' rel='noopener noreferrer'>
            <img src={cover} className='player-track-artwork-img' alt='Cover' />
          </a>
          <div className='player-track-text-group'>
            <span className='player-track-headline'>9</span>
            <span className='player-track-sub-artist'>by Drake</span>
          </div>
          <div className='player-timer-counter-code'>
            {formatTime(currentTime)} / {formatTime(maxTime)}
          </div>
          <audio id='audio' src={stop} />
        </div>

        <div className={`lol-profile-footer-navigation-nodes anim-y-scale anim-d6 ${entered ? 'anim-active' : ''}`} style={{ transform: 'translateZ(25px)' }}>
          <a href="https://instagram.com/m0icy.dll" target="_blank" rel="noopener noreferrer" className="footer-node-item">
            <img src={instaIcon} alt="Instagram" />
          </a>
          <a href="https://www.roblox.com/users/9652172792/profile" target="_blank" rel="noopener noreferrer" className="footer-node-item">
            <img src={robloxIcon} alt="Roblox" />
          </a>
          <a href="https://www.roblox.com/users/3780391314/profile?friendshipSourceType=PlayerSearch" target="_blank" rel="noopener noreferrer" className="footer-node-item">
            <img src={robloxIcon} alt="Roblox" />
          </a>
          <a href="https://dsc.gg/mnltsmp" target="_blank" rel="noopener noreferrer" className="footer-node-item">
            <img src={discordIcon} alt="Discord" />
          </a>
          <a href="https://discord.com/users/1491137614525370589" target="_blank" rel="noopener noreferrer" className="footer-node-item">
            <img src={discordIcon} alt="Discord" />
          </a>
          <a href="https://ko-fi.com/animosity" target="_blank" rel="noopener noreferrer" className="footer-node-item">
            <img src={support} alt="kofi" />
          </a>
        </div>

      </InteractiveCard>
      </div>
      </div>
    </div>
  );
}

export default App;
