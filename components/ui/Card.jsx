import React from 'react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 ${className}`}>
    {children}
  </div>
);

export default Card;
