import React, { useState, useRef, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './OTPVerificationPage.css';

function OTPVerificationPage() {
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    // Input Change Handler
    const handleChange = (index, value) => {
        // Only allow numbers
        if (isNaN(value)) return;

        const newOtp = [...otp];
        // Take the last character in case of paste or rapid typing
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input automatically if a digit was entered
        if (value !== '' && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    // Backspace, Delete, Right, Left arrow key handler
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            // If current input is empty, focus previous input and clear it
            if (otp[index] === '' && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputRefs[index - 1].current.focus();
            } else {
                // Just clear current input
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs[index - 1].current.focus();
        } else if (e.key === 'ArrowRight' && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    // Handle Paste event
    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text/plain').slice(0, 4);

        if (/^\d+$/.test(pasteData)) {
            const newOtp = [...otp];
            for (let i = 0; i < pasteData.length; i++) {
                newOtp[i] = pasteData[i];
            }
            setOtp(newOtp);

            // Focus on the next empty input or the last one
            const nextEmptyIndex = pasteData.length < 4 ? pasteData.length : 3;
            inputRefs[nextEmptyIndex].current.focus();
        }
    };


    return (
        <div className="otp-page-wrapper">
            <Header />
            <main className="otp-main">
                <div className="otp-card">
                    <div className="otp-card-header">
                        <div className="otp-icon-wrapper">
                            <i className="fa-solid fa-mobile-screen-button"></i>
                        </div>
                    </div>

                    <div className="otp-card-body">
                        <h2 className="otp-title">Verify Your Number</h2>
                        <p className="otp-subtitle">
                            We've sent a 4-digit verification code to
                            <br />
                            <strong>+1 (555) 000-0000</strong>
                        </p>

                        <form className="otp-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="otp-inputs-container">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        ref={inputRefs[index]}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className={`otp-input ${digit ? 'filled' : ''}`}
                                        placeholder="-"
                                    />
                                ))}
                            </div>

                            <button type="submit" className="otp-submit-btn">
                                <span>Verify & Continue</span>
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </form>

                        <div className="otp-footer-actions">
                            <p className="timer-text">
                                <i className="fa-regular fa-clock"></i> Resend code in <strong>0:59</strong>
                            </p>
                            <button className="resend-btn">
                                Didn't receive a code? Resend
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default OTPVerificationPage;
