import React from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "🎨 AI-Powered AEC Design Studio",
  subtitle = "Transform your vision into stunning design concepts"
}) => (
  <div className="text-center mb-8">
    <h1 className="text-4xl font-bold mb-4 text-gray-800">
      {title}
    </h1>
    {subtitle && (
      <p className="text-gray-600 text-lg">{subtitle}</p>
    )}
  </div>
);
export {}