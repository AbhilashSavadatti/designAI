import { useState } from 'react';
import { Button, Box, Textarea, Select, VStack } from '@chakra-ui/react';

export default function PromptInterface({ onSubmit }) {
  const [prompt, setPrompt] = useState('');
  const [useCase, setUseCase] = useState('interior');
  const [isRecording, setIsRecording] = useState(false);

  const useCases = [
    { value: 'interior', label: 'Interior Design' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'construction', label: 'Construction' },
    { value: 'event', label: 'Event Design' }
  ];

  const handleSubmit = () => {
    onSubmit({ prompt, useCase });
  };

  return (
    <VStack spacing={4} align="stretch">
      <Select 
        value={useCase}
        onChange={(e) => setUseCase(e.target.value)}
      >
        {useCases.map((uc) => (
          <option key={uc.value} value={uc.value}>{uc.label}</option>
        ))}
      </Select>
      
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your design vision..."
      />
      
      <Button 
        colorScheme="blue" 
        onClick={handleSubmit}
        isDisabled={!prompt}
      >
        Generate Designs
      </Button>
      
      <Button 
        variant="outline"
        onClick={() => setIsRecording(!isRecording)}
      >
        {isRecording ? 'Stop Recording' : 'Record Voice'}
      </Button>
    </VStack>
  );
}