import React, { useState, useEffect } from 'react';

const formatThousands = (num) => (num ? Number(num).toLocaleString('es-CO') : '');
const parseThousands = (str) => parseInt(str.replace(/[^\d]/g, ''), 10) || 0;

const InputField = ({ label, value, onChange, showThousands = false, className = '', ...props }) => {
  const [display, setDisplay] = useState(() => showThousands ? formatThousands(value) : '');

  useEffect(() => {
    if (showThousands) setDisplay(formatThousands(value));
  }, [value, showThousands]);

  const baseClass = `w-full p-2.5 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 ${className}`;

  if (showThousands) {
    const handleChange = (e) => {
      const num = parseThousands(e.target.value);
      setDisplay(num ? formatThousands(num) : '');
      onChange(num);
    };
    return (
      <div>
        {label && <label className="block text-xs font-bold text-slate-500 mb-1">{label}</label>}
        <input type="text" value={display} onChange={handleChange} className={baseClass} {...props} />
      </div>
    );
  }

  return (
    <div>
      {label && <label className="block text-xs font-bold text-slate-500 mb-1">{label}</label>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={baseClass}
        {...props}
      />
    </div>
  );
};

export default InputField;
