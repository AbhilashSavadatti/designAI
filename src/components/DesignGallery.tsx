import React from 'react';
import { DesignResult } from '../types';
import { DesignCard } from './DesignCard';

interface DesignGalleryProps {
  designs: DesignResult[];
  onDownload: (url: string, filename: string) => void;
}

export const DesignGallery: React.FC<DesignGalleryProps> = ({ 
  designs, 
  onDownload 
}) => {
  if (designs.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Generated Design Concepts
        </h2>
        <p className="text-gray-600">Your AI-powered design inspirations</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {designs.map((design, index) => (
          <DesignCard
            key={design.id}
            design={design}
            index={index}
            onDownload={onDownload}
          />
        ))}
      </div>
    </div>
  );
};