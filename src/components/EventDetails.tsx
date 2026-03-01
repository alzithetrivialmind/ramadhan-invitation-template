// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';

const revealVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.15 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(5px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
};

export default function EventDetails() {
    return (
        <section className="story-section details" id="section-details">
            <motion.div
                className="content-box"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15, margin: "0px 0px -100px 0px" }}
                variants={revealVariants}
            >
                <motion.p className="story-text" variants={itemVariants}>
                    Momen kebersamaan di bulan suci Ramadhan adalah saat yang istimewa untuk menyambung silaturahmi.
                    <br /><br />
                    Oleh karena itu, kami <span className="highlight">Nama Perusahaan Anda</span> mengundang
                    Bapak/Ibu/Saudara/i untuk hadir pada acara Buka Puasa Bersama yang Insya Allah akan dilaksanakan
                    pada:
                </motion.p>

                <motion.div className="event-card" variants={itemVariants}>
                    <div className="event-row">
                        <div className="icon">📅</div>
                        <div className="info">
                            <h3>Hari & Tanggal</h3>
                            <p>Sabtu, 1 Maret 2025</p>
                        </div>
                    </div>
                    <div className="event-row">
                        <div className="icon">📍</div>
                        <div className="info">
                            <h3>Tempat</h3>
                            <p>
                                <a href="#" target="_blank" rel="noreferrer" className="ig-link">
                                    Nama Restoran / Tempat Acara
                                </a>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
