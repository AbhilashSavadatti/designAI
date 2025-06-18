import { BASE_HIGHLIGHTS, DESIGN_STYLES } from './constants';

export const generateUniqueHighlights = (useCase: string): string[] => {
  const highlights = BASE_HIGHLIGHTS[useCase as keyof typeof BASE_HIGHLIGHTS] || [];
  return [...highlights].sort(() => 0.5 - Math.random()).slice(0, 3);
};

export const generateTitle = (useCase: string, prompt: string, index: number): string => {
  return `${useCase}: ${DESIGN_STYLES[(index + Math.floor(Math.random() * 5)) % DESIGN_STYLES.length]}`;
};

export const generateImageUrl = (useCase: string, prompt: string): string => {
  const sketchPrompt = `sketch style ${useCase}: ${prompt}`;
  const randomId = Math.random().toString(36).substring(2, 8);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(`${sketchPrompt} ${randomId}`)}`;
};

export const downloadImage = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export {}