import { useState } from 'react';
import { ChakraProvider, Container, Heading } from '@chakra-ui/react';
import PromptInterface from './components/PromptInterface';
import DesignOutput from './components/DesignOutput';
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
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={8}>
        <Heading mb={8}>AI Design Generator</Heading>
        <PromptInterface onSubmit={handleSubmit} />
        {isLoading && <p>Generating designs...</p>}
        {designs.length > 0 && <DesignOutput designs={designs} />}
      </Container>
    </ChakraProvider>
  );
}

export default App;
