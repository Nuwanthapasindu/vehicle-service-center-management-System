import React from 'react';

const UserIcon = ({ width = "18", height = "18", color = "currentColor" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" stroke={color} fill="none" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

export default UserIcon;
