import React from 'react';

const LockIcon = ({ width = "18", height = "18", color = "currentColor" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" stroke={color} fill="none" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

export default LockIcon;
