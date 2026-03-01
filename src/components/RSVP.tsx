// @ts-nocheck
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function RSVP() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [count, setCount] = useState(1);
    const [childrenCount, setChildrenCount] = useState(0);
    const [names, setNames] = useState<string[]>(['']);
    const [paymentMethod, setPaymentMethod] = useState<string>(''); // 'transfer' | 'cash'

    // =============================================
    // 🔧 KUSTOMISASI: Ganti data berikut sesuai acara Anda
    // =============================================
    const whatsappNumber = '628XXXXXXXXXX';         // Nomor WhatsApp tujuan
    const BIAYA_PER_ORANG = 50000;                  // Biaya per peserta dewasa
    const NAMA_ACARA = 'Buka Puasa Bersama';        // Nama acara
    const NAMA_PENYELENGGARA = 'Perusahaan Anda';   // Nama perusahaan/penyelenggara
    const BANK_NAME = 'BCA';                        // Nama bank
    const BANK_ACCOUNT = '0000000000';               // Nomor rekening
    const BANK_HOLDER = 'Nama Pemilik Rekening';     // Nama pemilik rekening
    // 🔧 Deadline (opsional): Set true dan isi tanggal untuk mengaktifkan countdown
    const ENABLE_DEADLINE = false;
    const DEADLINE_DATE = new Date('2025-12-31T23:59:59').getTime();
    // =============================================

    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);
    const [isPastDeadline, setIsPastDeadline] = useState(false);

    useEffect(() => {
        if (!ENABLE_DEADLINE) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = DEADLINE_DATE - now;

            if (difference <= 0) {
                setIsPastDeadline(true);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setIsPastDeadline(false);
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
        setStep(1);
        setCount(1);
        setChildrenCount(0);
        setNames(['']);
        setPaymentMethod('');
    };

    const handleNextStep1 = () => {
        setStep(2);
    };

    const handleNextStep2 = () => {
        const total = count + childrenCount;
        const newNames = Array(total).fill('');
        for (let i = 0; i < total; i++) {
            newNames[i] = names[i] || '';
        }
        setNames(newNames);
        setStep(3);
    };

    const handleNextStep3 = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(4);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentMethod) {
            alert('Silakan pilih metode pembayaran.');
            return;
        }

        const validNames = names.filter(n => n.trim() !== '');
        const senderName = validNames.length > 0 ? validNames[0] : 'Seseorang';
        const totalBiaya = count * BIAYA_PER_ORANG;

        let textMessage = `Halo, saya *${senderName}* ingin mengonfirmasi kehadiran untuk acara *${NAMA_ACARA} ${NAMA_PENYELENGGARA}*.\n\n`;
        textMessage += `Berikut adalah rincian pendaftaran saya:\n`;
        textMessage += `- Jumlah Peserta Dewasa: *${count}* orang\n`;

        if (childrenCount > 0) {
            textMessage += `- Jumlah Peserta Anak: *${childrenCount}* orang (Gratis)\n`;
        }

        if (validNames.length > 0) {
            textMessage += `- Daftar Nama:\n`;
            let adultIndex = 1;
            let childIndex = 1;
            validNames.forEach((name, index) => {
                if (index < count) {
                    const role = index === 0 ? " (Perwakilan)" : ` (Dewasa ${adultIndex})`;
                    textMessage += `  ${index + 1}. ${name}${role}\n`;
                    adultIndex++;
                } else {
                    textMessage += `  ${index + 1}. ${name} (Anak ${childIndex})\n`;
                    childIndex++;
                }
            });
        }

        textMessage += `\n- Total Biaya: *Rp ${totalBiaya.toLocaleString('id-ID')}*\n`;
        textMessage += `- Metode Pembayaran: *${paymentMethod === 'transfer' ? 'Transfer' : 'Cash'}*\n`;
        textMessage += `\nTerima kasih.`;

        // 🔧 KUSTOMISASI: Google Sheets Integration (opsional)
        // Ganti URL di bawah dengan URL Web App dari Google Apps Script Anda.
        // Lihat README.md untuk panduan setup Google Sheets integration.
        const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL';

        if (GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_SCRIPT_URL') {
            const formData = new FormData();
            formData.append('namaLengkap', senderName);
            formData.append('jumlahDewasa', count.toString());
            formData.append('jumlahAnak', childrenCount.toString());

            let allNames = validNames.map((name, i) => {
                if (i < count) return `${name} (Dewasa)`;
                return `${name} (Anak)`;
            }).join(', ');
            formData.append('daftarNama', allNames);
            formData.append('totalBiaya', totalBiaya.toString());
            formData.append('metodePembayaran', paymentMethod === 'transfer' ? 'Transfer' : 'Cash');

            try {
                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });
            } catch (err) {
                console.error("Gagal mengirim ke Google Sheets:", err);
            }
        }

        // Buka WhatsApp
        const encodedMessage = encodeURIComponent(textMessage);
        const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(waUrl, '_blank');
        setIsOpen(false);
    };

    return (
        <section className="story-section rsvp" id="section-rsvp">
            <motion.div
                className="content-box"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15, margin: "0px 0px -100px 0px" }}
                variants={revealVariants}
            >
                <motion.p className="quote" variants={itemVariants}>
                    "Kebersamaan yang Menguatkan,<br />Silaturahmi yang Menghangatkan"
                </motion.p>
                <motion.p className="story-text small" variants={itemVariants}>
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir.
                    Silakan klik tombol di bawah ini untuk mengonfirmasi kehadiran Anda.
                </motion.p>
                <motion.div className="action-container" variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {ENABLE_DEADLINE && isPastDeadline ? (
                        <div style={{ background: '#fff0f0', padding: '1rem 2rem', borderRadius: '15px', border: '1px solid #fecaca', color: '#e53e3e', fontWeight: 'bold' }}>
                            Mohon maaf, pendaftaran telah ditutup.
                        </div>
                    ) : (
                        <>
                            {ENABLE_DEADLINE && timeLeft && (
                                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Batas Akhir Pendaftaran:</p>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        <div style={{ background: '#fff', padding: '0.5rem', borderRadius: '8px', minWidth: '60px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-orange)', display: 'block' }}>{timeLeft.days}</span>
                                            <span style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Hari</span>
                                        </div>
                                        <div style={{ background: '#fff', padding: '0.5rem', borderRadius: '8px', minWidth: '60px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-orange)', display: 'block' }}>{timeLeft.hours}</span>
                                            <span style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Jam</span>
                                        </div>
                                        <div style={{ background: '#fff', padding: '0.5rem', borderRadius: '8px', minWidth: '60px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-orange)', display: 'block' }}>{timeLeft.minutes}</span>
                                            <span style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Menit</span>
                                        </div>
                                        <div style={{ background: '#fff', padding: '0.5rem', borderRadius: '8px', minWidth: '60px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-orange)', display: 'block' }}>{timeLeft.seconds}</span>
                                            <span style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Detik</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <button onClick={handleOpen} className="btn-primary">
                                Konfirmasi Kehadiran
                                <span className="btn-glow"></span>
                            </button>
                        </>
                    )}
                </motion.div>
            </motion.div>

            <div className="mosque-silhouette"></div>
            <div className="dunes"></div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="modal-overlay active"
                        style={{ display: 'flex' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            style={{ maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <button onClick={() => setIsOpen(false)} className="close-btn">&times;</button>
                            <div className="modal-header">
                                <h2>Konfirmasi Kehadiran</h2>
                                <p>{NAMA_ACARA} {NAMA_PENYELENGGARA}</p>
                            </div>

                            {step === 1 && (
                                <form>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="form-step active"
                                        style={{ display: 'block' }}
                                    >
                                        <p className="step-desc">Berapa orang <strong>Dewasa</strong> yang akan hadir (termasuk Anda)?</p>
                                        <div className="counter-input large" style={{ margin: '0 auto 2rem auto' }}>
                                            <button type="button" className="counter-btn" onClick={() => setCount(Math.max(1, count - 1))}>-</button>
                                            <input type="number" value={count} readOnly />
                                            <button type="button" className="counter-btn" onClick={() => setCount(Math.min(20, count + 1))}>+</button>
                                        </div>
                                        <button type="button" onClick={handleNextStep1} className="btn-submit" style={{ width: '100%' }}>Lanjut</button>
                                    </motion.div>
                                </form>
                            )}

                            {step === 2 && (
                                <form>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="form-step active"
                                        style={{ display: 'block' }}
                                    >
                                        <p className="step-desc">Berapa <strong>Anak-anak</strong> yang turut diundang? (Maksimal 3, Gratis)</p>
                                        <p style={{ fontSize: '0.8rem', color: '#e53e3e', marginTop: '0.3rem', marginBottom: '0.5rem', fontStyle: 'italic' }}>*Anak-anak yang dimaksud adalah usia maksimal 10 tahun.</p>
                                        <div className="counter-input large" style={{ margin: '0 auto 2rem auto' }}>
                                            <button type="button" className="counter-btn" onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}>-</button>
                                            <input type="number" value={childrenCount} readOnly />
                                            <button type="button" className="counter-btn" onClick={() => setChildrenCount(Math.min(3, childrenCount + 1))}>+</button>
                                        </div>
                                        <div className="form-actions">
                                            <button type="button" onClick={() => setStep(1)} className="btn-secondary">Kembali</button>
                                            <button type="button" onClick={handleNextStep2} className="btn-submit">Lanjut</button>
                                        </div>
                                    </motion.div>
                                </form>
                            )}

                            {step === 3 && (
                                <form onSubmit={handleNextStep3}>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="form-step active"
                                        style={{ display: 'block' }}
                                    >
                                        <p className="step-desc">Silakan masukkan nama-nama peserta:</p>
                                        <div className="participant-fields" style={{ maxHeight: '35vh' }}>
                                            {names.map((name, i) => {
                                                const isAdult = i < count;
                                                const childIndex = i - count + 1;
                                                const label = isAdult ? (i === 0 ? 'Nama Anda (Perwakilan Dewasa)' : `Nama Dewasa ${i + 1}`) : `Nama Anak ${childIndex}`;
                                                const placeholder = isAdult ? (i === 0 ? 'Contoh: Budi Susanto' : 'Masukkan nama dewasa') : 'Masukkan nama anak';
                                                return (
                                                    <div key={i} className="input-wrapper">
                                                        <label>{label}</label>
                                                        <input
                                                            type="text"
                                                            className="participant-name"
                                                            placeholder={placeholder}
                                                            required
                                                            value={name}
                                                            onChange={(e) => {
                                                                const n = [...names];
                                                                n[i] = e.target.value;
                                                                setNames(n);
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="form-actions">
                                            <button type="button" onClick={() => setStep(2)} className="btn-secondary">Kembali</button>
                                            <button type="submit" className="btn-submit">Lanjut Pembayaran</button>
                                        </div>
                                    </motion.div>
                                </form>
                            )}

                            {step === 4 && (
                                <form onSubmit={handleSubmit}>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="form-step active"
                                        style={{ display: 'block' }}
                                    >
                                        <p className="step-desc" style={{ marginBottom: '1rem' }}>Rangkuman & Pembayaran</p>

                                        <div style={{ background: '#f8f8f8', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.95rem' }}>
                                            <p><strong>Peserta Dewasa:</strong> {count} orang</p>
                                            {childrenCount > 0 && <p><strong>Peserta Anak:</strong> {childrenCount} orang (Gratis)</p>}
                                            <p><strong>Biaya per Dewasa:</strong> Rp {BIAYA_PER_ORANG.toLocaleString('id-ID')}</p>
                                            <hr style={{ margin: '0.8rem 0', borderColor: '#ddd' }} />
                                            <p style={{ fontSize: '1.2rem', color: 'var(--primary-red)', fontWeight: 'bold' }}>
                                                Total Biaya: Rp {(count * BIAYA_PER_ORANG).toLocaleString('id-ID')}
                                            </p>
                                        </div>

                                        <p style={{ textAlign: 'left', marginBottom: '0.8rem', fontWeight: 'bold' }}>Pilih Jenis Pembayaran:</p>
                                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                                            <label style={{
                                                flex: 1,
                                                border: paymentMethod === 'transfer' ? '2px solid var(--primary-orange)' : '1px solid #ddd',
                                                padding: '1rem',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                background: paymentMethod === 'transfer' ? '#fffaf7' : '#fff'
                                            }}>
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="transfer"
                                                    checked={paymentMethod === 'transfer'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    style={{ display: 'none' }}
                                                />
                                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💳</div>
                                                <strong>Transfer</strong>
                                            </label>
                                            <label style={{
                                                flex: 1,
                                                border: paymentMethod === 'cash' ? '2px solid var(--primary-orange)' : '1px solid #ddd',
                                                padding: '1rem',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                background: paymentMethod === 'cash' ? '#fffaf7' : '#fff'
                                            }}>
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="cash"
                                                    checked={paymentMethod === 'cash'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    style={{ display: 'none' }}
                                                />
                                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💵</div>
                                                <strong>Cash</strong>
                                            </label>
                                        </div>

                                        {paymentMethod === 'transfer' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                style={{
                                                    background: '#ebf4ff',
                                                    border: '1px solid #c3dafe',
                                                    padding: '1rem',
                                                    borderRadius: '10px',
                                                    marginBottom: '2rem',
                                                    textAlign: 'center',
                                                    color: '#2b6cb0'
                                                }}
                                            >
                                                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Silakan transfer ke rekening berikut:</p>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0.2rem 0', color: '#1a365d' }}>{BANK_NAME} {BANK_ACCOUNT}</h3>
                                                <p style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>a.n {BANK_HOLDER}</p>
                                                <p style={{ fontSize: '0.85rem', marginTop: '0.8rem', color: '#4a5568' }}>*Mohon sertakan bukti transfer saat mengirim pesan WhatsApp nanti.</p>
                                            </motion.div>
                                        )}

                                        <div className="form-actions">
                                            <button type="button" onClick={() => setStep(3)} className="btn-secondary">Kembali</button>
                                            <button type="submit" className="btn-submit">
                                                Kirim ke WhatsApp
                                            </button>
                                        </div>
                                    </motion.div>
                                </form>
                            )}

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
