import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Attempt automatic playback
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                }).catch(error => {
                    // Auto-play was prevented by browser, wait for user interaction
                    console.log("Autoplay prevented:", error);
                    setIsPlaying(false);
                });
            }
        }

        // Fallback: Play on any first interaction if blocked
        const handleFirstInteraction = () => {
            if (audioRef.current && !isPlaying) {
                const promise = audioRef.current.play();
                if (promise !== undefined) {
                    promise.then(() => {
                        setIsPlaying(true);
                    }).catch(e => console.log("Still blocking autoplay:", e));
                }
            }
            // Remove listeners after first attempt
            ['click', 'touchstart', 'scroll'].forEach(event => {
                document.removeEventListener(event, handleFirstInteraction);
            });
        };

        ['click', 'touchstart', 'scroll'].forEach(event => {
            document.addEventListener(event, handleFirstInteraction, { once: true });
        });

        return () => {
            ['click', 'touchstart', 'scroll'].forEach(event => {
                document.removeEventListener(event, handleFirstInteraction);
            });
        };
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <>
            <audio ref={audioRef} src="/audio.mp3" loop />

            <motion.button
                onClick={togglePlay}
                className="audio-btn"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    position: 'fixed',
                    top: '1.5rem',
                    right: '1.5rem',
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    background: 'var(--gradient-text)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(234, 46, 22, 0.3)',
                    cursor: 'pointer',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isPlaying ? '🎵' : '🔇'}
            </motion.button>
        </>
    );
}
