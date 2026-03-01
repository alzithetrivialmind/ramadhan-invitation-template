import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAB() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const rsvp = document.getElementById('section-rsvp');
            if (rsvp) {
                const rect = rsvp.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.8) {
                    setVisible(false);
                } else {
                    setVisible(true);
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToRSVP = (e: React.MouseEvent) => {
        e.preventDefault();
        const rsvp = document.getElementById('section-rsvp');
        if (rsvp) rsvp.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.a
                    href="#section-rsvp"
                    className="fab"
                    onClick={scrollToRSVP}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, y: 50 }}
                    style={{ display: 'flex' }}
                >
                    <span className="fab-icon">✉️</span> Konfirmasi Kehadiran
                </motion.a>
            )}
        </AnimatePresence>
    );
}
