'use client';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="label-text" htmlFor={props.id}>{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">{icon}</div>}
        <input className={`input-field ${icon ? 'pl-10' : ''} ${error ? 'border-error focus:border-error focus-visible:ring-error/20' : ''} ${className}`} {...props} />
      </div>
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}
