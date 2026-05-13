import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface CinematicHeaderProps {
  image: string;
  title: string;
}

const PropertyCinematicHeader: React.FC<CinematicHeaderProps> = ({ image, title }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Fallback drone footage
  const videoUrl = "https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ca2a8bc97cb2ea944f2e6ee5&profile_id=164&oauth2_token_id=57447761";

  return (
    <div className="relative rounded-[40px] overflow-hidden shadow-2xl aspect-[4/3] group bg-black">
      {!isVideoLoaded && (
        <img 
          src={image} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        />
      )}
      
      <video
        src={videoUrl}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        onLoadedData={() => setIsVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-6 left-6 flex space-x-4">
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsPlaying(!isPlaying);
              const video = e.currentTarget.parentElement?.parentElement?.parentElement?.querySelector('video');
              if (video) {
                if (isPlaying) {
                  video.pause();
                } else {
                  video.play();
                }
              }
            }}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsMuted(!isMuted);
            }}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
        <div className="absolute bottom-6 right-6">
          <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <Maximize2 size={20} />
          </button>
        </div>
      </div>

      <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full flex items-center space-x-2 border border-white/10">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        <span>DRONE FEED LIVE</span>
      </div>
    </div>
  );
};

export default PropertyCinematicHeader;
