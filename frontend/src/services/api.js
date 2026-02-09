import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Ajusta según tu puerto de backend

export const analyzePerson = async (textData) => {
  try {
    const response = await axios.post(`${API_URL}/deepseek/analyze`, { text: textData });
    return response.data.analysis;
  } catch (error) {
    console.error("Error en la petición:", error);
    throw error;
  }
};