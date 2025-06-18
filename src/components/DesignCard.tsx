import React from 'react';
import { DesignResult } from '../types';

interface DesignCardProps {
  design: DesignResult;
  index: number;
  onDownload: (url: string, filename: string) => void;
}

export const DesignCard: React.FC<DesignCardProps> = ({ 
  design, 
  index, 
  onDownload 
}) => (
  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
    <div className="relative group mb-4">
      <img
        src={design.imageUrl}
        alt={design.title}
        className="w-full rounded-lg group-hover:opacity-90 transition-opacity"
        loading="lazy"
      />
      <button
        onClick={() => onDownload(design.imageUrl, `design_${index + 1}`)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded-lg text-sm font-bold shadow-lg"
      >
        ⬇️ Download
      </button>
    </div>
    
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-gray-800">{design.title}</h3>
      <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">
        "{design.prompt}"
      </p>
      
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h4>
        <ul className="space-y-1">
          {design.highlights.map((highlight, idx) => (
            <li key={idx} className="flex items-start text-sm text-gray-600">
              <span className="text-green-500 mr-2 mt-0.5">✓</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);