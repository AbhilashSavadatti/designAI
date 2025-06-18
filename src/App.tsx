import React, { useState, useEffect } from 'react';
import { DesignResult } from './types';
import { Header } from './components/Header';
import { UseCaseSelector } from './components/UseCaseSelector';
import { PromptInput } from './components/PromptInput';
import { SpeechToText } from './components/SpeechToText';
import { GenerateButton } from './components/GenerateButton';
import { LoadingSpinner } from './components/LoadingSpinner';
import { DesignGallery } from './components/DesignGallery';
import {
  generateImageUrl,
  generateTitle,
  generateUniqueHighlights,
  downloadImage
} from './utils/designGenerator';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [useCase, setUseCase] = useState('');
  const [designs, setDesigns] = useState<DesignResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUseCaseChange = (newUseCase: string) => {
    setUseCase(newUseCase);
    if (newUseCase !== useCase) {
      setPrompt('');
      setDesigns([]);
    }
  };

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
  };

  const handleSpeechTranscript = (transcript: string) => {
    setPrompt(transcript);
  };

  const generateImages = async () => {
    if (!prompt.trim() || !useCase) return;
    
    setLoading(true);
    
    try {
    
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDesigns: DesignResult[] = Array.from({ length: 3 }, (_, index) => ({
        id: `design-${Date.now()}-${index}`,
        imageUrl: generateImageUrl(useCase, prompt),
        title: generateTitle(useCase, prompt, index),
        highlights: generateUniqueHighlights(useCase),
        prompt: prompt.trim()
      }));

      setDesigns(newDesigns);
    } catch (error) {
      console.error('Error generating designs:', error);
      alert('Failed to generate designs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    downloadImage(url, filename);
  };

  const isGenerateDisabled = !prompt.trim() || !useCase || loading;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      </div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className={`relative z-10 transition-all duration-1000 ease-out ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg shadow-black/5">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Design Studio
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="pt-24 pb-12">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center px-6 mb-16">
            <div className={`transition-all duration-1000 delay-200 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
                Design with
                <span className="pb-10 z-10 block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Intelligence
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Transform your ideas into stunning visuals with our AI-powered design studio. 
                Professional results in seconds.
              </p>
            </div>
          </div>

          {/* Main Interface */}
          <div className="max-w-7xl mx-auto px-6">
            {/* Glass Card Container */}
            <div className={`backdrop-blur-xl bg-white/70 rounded-3xl border border-white/20 shadow-2xl shadow-black/10 p-8 md:p-12 transition-all duration-1000 delay-400 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              
              {/* Use Case Selection */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
                  What would you like to create?
                </h2>
                <UseCaseSelector
                  value={useCase}
                  onChange={handleUseCaseChange}
                />
              </div>

              {/* Input Section */}
              <div className={`space-y-8 transition-all duration-700 ease-out ${
                useCase ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="relative">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Describe your vision
                  </h3>
                  
                  {/* Input Container */}
                  <div className="relative backdrop-blur-sm bg-white/50 rounded-2xl border border-white/30 p-6 shadow-lg">
                    <div className="flex gap-4 items-start">
                      <div className="flex-1">
                        <PromptInput
                          value={prompt}
                          onChange={handlePromptChange}
                          disabled={loading}
                        />
                      </div>
                      <div className="flex-shrink-0">
                        <SpeechToText
                          onTranscript={handleSpeechTranscript}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="text-center">
                  <GenerateButton
                    onClick={generateImages}
                    loading={loading}
                    disabled={isGenerateDisabled}
                  />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="mt-12">
                <div className="backdrop-blur-xl bg-white/70 rounded-3xl border border-white/20 shadow-2xl shadow-black/10 p-12">
                  <LoadingSpinner />
                  <div className="text-center mt-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                      Creating your designs...
                    </h3>
                    <p className="text-gray-600">
                      Our AI is crafting something amazing for you
                    </p>
                  </div>
                </div>
              </div>
            )}

          
            {designs.length > 0 && !loading && (
              <div className="mt-16 animate-[fadeIn_0.8s_ease-out]">
                {/* Gallery Header */}
                <div className=" mx-auto text-center mb-12">
                  <div className="backdrop-blur-xl bg-white/70 rounded-3xl border border-white/20 shadow-2xl shadow-black/10 p-8">
                    <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                      Your Designs Are Ready
                    </h3>
                    <p className="text-lg text-gray-600">
                      Swipe through your AI-generated masterpieces
                    </p>
                  </div>
                </div>

                {/* Full Width Carousel Container */}
                <div className="w-full overflow-hidden">
                  <div className="backdrop-blur-xl bg-white/40 border-y border-white/20 shadow-2xl shadow-black/5 py-12">
                    <div className="relative">
                      {/* Carousel Track */}
                      <div className="carousel-track flex gap-8 px-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth">

                        {designs.map((design, index) => (
                          <div
                            key={design.id}
                            className="flex-none w-80 md:w-96 snap-center group animate-[slideIn_0.6s_ease-out] opacity-0"
                            style={{
                              animationDelay: `${index * 0.2}s`,
                              animationFillMode: 'forwards'
                            }}
                          >
                            {/* Card Container */}
                            <div className="relative backdrop-blur-2xl bg-white/80 rounded-2xl border border-white/30 shadow-2xl shadow-black/10 overflow-hidden group-hover:shadow-3xl group-hover:shadow-black/20 transition-all duration-500 ">
                              
                              {/* Image Container */}
                              <div className="relative overflow-hidden">
                                <img
                                  src={design.imageUrl}
                                  alt={design.title}
                                  className="group-hover:scale-105  w-full h-64 md:h-80 object-cover transition-transform duration-700 "
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {/* Floating Action Button */}
                                <button
                                  onClick={() => handleDownload(design.imageUrl, design.title)}
                                  className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:scale-110"
                                >
                                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </button>
                              </div>

                              {/* Card Content */}
                              <div className="p-6">
                                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                  {design.title}
                                </h4>
                                
                                {/* Highlights */}
                                {design.highlights && design.highlights.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {design.highlights.slice(0, 3).map((highlight, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200/50 " 
                                      >
                                        {highlight}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Original Prompt */}
                                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                  "{design.prompt}"
                                </p>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => handleDownload(design.imageUrl, design.title)}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download
                                  </button>
                                  {/* <button className="px-4 py-2 bg-white/80 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200 flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                  </button> */}
                                </div>
                              </div>

                              {/* Premium Badge */}
                              <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg">
                                AI Generated
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Add More Card */}
                        <div className="flex-none w-80 md:w-96 snap-center">
                          <div className="h-full backdrop-blur-2xl bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-2xl border-2 border-dashed border-blue-300/50 flex flex-col items-center justify-center p-8 text-center group hover:border-blue-400/70 transition-all duration-300 hover:bg-blue-50/90">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Create More</h4>
                            <p className="text-sm text-gray-600 mb-4">Try different prompts and styles</p>
                            <button
                              onClick={() => {
                                setPrompt('');
                                setDesigns([]);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                            >
                              Start Over
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right Arrow Scroll Button */}
<button
  onClick={() => {
    const container = document.querySelector('.carousel-track');
    if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
  }}
  className="hidden md:flex items-center justify-center absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 shadow-md rounded-full w-10 h-10 transition-all duration-300"
>
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
</button>


                      {/* Scroll Indicators */}
                      <div className="flex justify-center mt-8 space-x-2">
                        {designs.map((_, index) => (
                          <div
                            key={index}
                            className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30"
                            style={{
                              animation: `fadeIn 0.6s ease-out ${index * 0.1}s forwards`
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="max-w-4xl mx-auto mt-8 text-center">
                  <div className="backdrop-blur-xl bg-white/70 rounded-2xl border border-white/20 shadow-xl shadow-black/5 p-6">
                    <p className="text-gray-600 mb-4">Love what you see? Generate more variations or try a different style</p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={generateImages}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Generate More
                      </button>
                      <button
                        onClick={() => {
                          setPrompt('');
                          setUseCase('');
                          setDesigns([]);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3 bg-white/80 text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200"
                      >
                        New Project
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-24 py-12 border-t border-white/20 backdrop-blur-xl bg-white/30">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md"></div>
                <span className="text-lg font-semibold text-gray-800">AI Design Studio</span>
              </div>
              <p className="text-gray-600 mb-6">
                Empowering creativity with artificial intelligence
              </p>
              <div className="flex justify-center space-x-6">
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">Privacy</a>
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">Terms</a>
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">Support</a>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
          
          /* Hide scrollbar for carousel */
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          
          /* Line clamp utility */
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          /* Custom scrollbar for main page */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.3);
          }
          
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Custom animations */
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out;
          }
        `
      }} />
    </div>
  );
};

export default App;