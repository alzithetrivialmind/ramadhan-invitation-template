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

export default function Hero() {
    return (
        <section className="story-section hero" id="section-hero">
            <div className="bg-pattern"></div>

            <motion.div
                className="content-box"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15, margin: "0px 0px -100px 0px" }}
                variants={revealVariants}
            >
                <motion.div className="logo-container" variants={itemVariants}>
                    <h2 className="logo-text">NAMA</h2>
                    <p className="logo-subtext">PERUSAHAAN</p>
                </motion.div>
                <div className="invitation-details">
                    <motion.p className="pre-title" variants={itemVariants}>Undangan</motion.p>
                    <motion.h1 className="title" variants={itemVariants}>Buka Puasa Bersama</motion.h1>
                    <motion.p className="subtitle" variants={itemVariants}>Staff & Mitra Kerja</motion.p>
                    <motion.h2 className="company-name" variants={itemVariants}>Nama Perusahaan Anda</motion.h2>
                    <motion.p className="hijri-date" variants={itemVariants}>1446 H / 2025 M</motion.p>
                </div>
            </motion.div>
        </section>
    );
}
