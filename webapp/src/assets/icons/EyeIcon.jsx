import React from 'react';

const EyeIcon = ({ width = "18", height = "18", color = "var(--text-muted)", strokeWidth = "2" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

export default EyeIcon;
