const express = require('express');
const cors = require('cors');
const multer = require('multer');
const OpenAI = require('openai');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();
console.log("1. Requires loaded");
console.log("Server starting...");
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Use case specific prompts and configurations
const USE_CASE_CONFIGS = {
  interior: {
    name: 'Interior Design',
    imageStyle: 'interior design, modern, architectural visualization, high-quality render',
    promptTemplate: (userPrompt) => `Create an interior design concept based on: "${userPrompt}". 
    Focus on: space planning, furniture selection, color schemes, lighting design, material choices, and functionality.
    Consider ergonomics, aesthetics, and user experience.`,
    highlights: ['Space Planning', 'Furniture Selection', 'Color Scheme', 'Lighting Design', 'Material Choices']
  },
  architecture: {
    name: 'Architecture', 
    imageStyle: 'architectural design, building exterior, modern architecture, concept sketch',
    promptTemplate: (userPrompt) => `Create an architectural design concept based on: "${userPrompt}".
    Focus on: building form, structural elements, sustainability features, site integration, and aesthetic appeal.
    Consider environmental factors, building codes, and user needs.`,
    highlights: ['Building Form', 'Structural Design', 'Sustainability', 'Site Integration', 'Aesthetic Appeal']
  },
  construction: {
    name: 'Construction',
    imageStyle: 'construction planning, building process, technical drawing, project management',
    promptTemplate: (userPrompt) => `Create a construction project concept based on: "${userPrompt}".
    Focus on: construction methodology, timeline planning, resource allocation, safety considerations, and stakeholder coordination.
    Consider project phases, material logistics, and quality control.`,
    highlights: ['Construction Method', 'Timeline Planning', 'Resource Allocation', 'Safety Planning', 'Quality Control']
  },
  event: {
    name: 'Event Design',
    imageStyle: 'event design, venue setup, decorative elements, lighting design',
    promptTemplate: (userPrompt) => `Create an event design concept based on: "${userPrompt}".
    Focus on: venue layout, seating arrangements, lighting design, decorative elements, and guest experience.
    Consider event flow, accessibility, and thematic coherence.`,
    highlights: ['Venue Layout', 'Seating Design', 'Lighting Setup', 'Decorative Elements', 'Guest Experience']
  }
};

// Helper function to generate design variations
function generateDesignVariations(basePrompt, useCase) {
  const variations = [
    { suffix: 'modern minimalist approach with clean lines and neutral colors', style: 'minimalist' },
    { suffix: 'warm and cozy atmosphere with natural materials and earth tones', style: 'natural' },
    { suffix: 'bold contemporary design with vibrant colors and innovative features', style: 'contemporary' }
  ];

  return variations.map((variation, index) => ({
    title: `${useCase.name} Concept ${index + 1} - ${variation.style.charAt(0).toUpperCase() + variation.style.slice(1)}`,
    prompt: `${basePrompt} with ${variation.suffix}`,
    style: variation.style
  }));
}

// Helper function to generate image using DALL-E
async function generateImage(prompt, style) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${prompt}, ${style}, professional architectural visualization, high quality, detailed`,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    return response.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    // Return a placeholder image URL if DALL-E fails
    return `https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Design+Concept+${Math.floor(Math.random() * 1000)}`;
  }
}

// Helper function to generate design highlights using GPT
async function generateDesignHighlights(prompt, useCase) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert ${useCase.name.toLowerCase()} professional. Generate 5 specific, actionable design highlights based on the given prompt.`
        },
        {
          role: "user",
          content: `Based on this design prompt: "${prompt}", provide 5 key design highlights that are specific and actionable. Format as a simple array of strings.`
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    // Extract highlights from the response
    const highlights = content.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
      .slice(0, 5);

    return highlights.length > 0 ? highlights : useCase.highlights;
  } catch (error) {
    console.error('Error generating highlights:', error);
    return useCase.highlights;
  }
}

// Helper function to generate design summary using GPT
async function generateDesignSummary(prompt, style) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a design expert. Create a concise, professional summary of a design concept in 2-3 sentences."
        },
        {
          role: "user",
          content: `Create a brief summary for this design concept: "${prompt}" with ${style} style.`
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    return `A ${style} design concept that combines functionality with aesthetic appeal, creating a space that meets both practical and visual requirements.`;
  }
}

// Main API endpoint for design generation
app.post('/api/designs', async (req, res) => {
  try {
    const { prompt, useCase } = req.body;

    if (!prompt || !useCase) {
      return res.status(400).json({ 
        error: 'Missing required fields: prompt and useCase' 
      });
    }

    const useCaseConfig = USE_CASE_CONFIGS[useCase];
    if (!useCaseConfig) {
      return res.status(400).json({ 
        error: 'Invalid use case. Must be one of: interior, architecture, construction, event' 
      });
    }

    // Generate the base prompt
    const basePrompt = useCaseConfig.promptTemplate(prompt);
    
    // Generate three design variations
    const designVariations = generateDesignVariations(basePrompt, useCaseConfig);

    // Generate designs concurrently for better performance
    const designPromises = designVariations.map(async (variation) => {
      const [image, highlights, summary] = await Promise.all([
        generateImage(variation.prompt, useCaseConfig.imageStyle),
        generateDesignHighlights(variation.prompt, useCaseConfig),
        generateDesignSummary(variation.prompt, variation.style)
      ]);

      return {
        title: variation.title,
        image: image,
        summary: summary,
        highlights: highlights,
        style: variation.style
      };
    });

    const designs = await Promise.all(designPromises);

    res.json(designs);

  } catch (error) {
    console.error('Error generating designs:', error);
    res.status(500).json({ 
      error: 'Failed to generate designs',
      details: error.message 
    });
  }
});

// Speech-to-text API endpoint
app.post('/api/speech-to-text', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Create FormData for OpenAI Whisper API
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: 'audio.wav',
      contentType: req.file.mimetype
    });
    formData.append('model', 'whisper-1');

    const response = await openai.audio.transcriptions.create({
      file: req.file.buffer,
      model: "whisper-1",
    });

    res.json({ 
      text: response.text,
      success: true 
    });

  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ 
      error: 'Failed to transcribe audio',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get available use cases
app.get('/api/use-cases', (req, res) => {
  const useCases = Object.entries(USE_CASE_CONFIGS).map(([key, config]) => ({
    value: key,
    label: config.name
  }));
  
  res.json(useCases);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Design Generator Backend running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎨 Design API: http://localhost:${PORT}/api/designs`);
  console.log(`🎤 Speech API: http://localhost:${PORT}/api/speech-to-text`);
});

module.exports = app;