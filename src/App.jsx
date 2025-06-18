import { useState } from 'react';
import PromptInterface from './components/PromptInterface/PromptInterface';
import DesignOutput from './components/DesignOutput/DesignOutput';
import { generateDesigns } from './Services/designService';

function App() {
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async ({ prompt, useCase }) => {
    setIsLoading(true);
    try {
      const generatedDesigns = await generateDesigns(prompt, useCase);
      setDesigns(generatedDesigns);
    } catch (error) {
      console.error('Error generating designs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        AI Design Generator
      </h1>
      <PromptInterface onSubmit={handleSubmit} />
      {isLoading && <p>Generating designs...</p>}
      {designs.length > 0 && <DesignOutput designs={designs} />}
    </div>
  );
}

export default App;