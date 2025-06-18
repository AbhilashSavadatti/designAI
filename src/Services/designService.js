import axios from 'axios';

const API_URL = 'http://localhost:3001/api/designs';

export async function generateDesigns(prompt, useCase) {
  try {
    const response = await axios.post(API_URL, {
      prompt,
      useCase
    });
    return response.data;
  } catch (error) {
    console.error('Error generating designs:', error);
    throw error;
  }
}