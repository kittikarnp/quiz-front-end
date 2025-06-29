import axios from 'axios';

const API_BASE_URL = 'https://webapi.icydune-a1052ab7.southeastasia.azurecontainerapps.io/api/v1/Quiz';

export const createSession = async (): Promise<string> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Session`, {}, {
      headers: {
        'Accept': 'text/plain'
      }
    });

 

    const sessionId = response.data?.data?.sessionId; // ชื่อ key ต้องตรงเป๊ะ
    return sessionId;
  } catch (error) {
    console.error('❌ createSession API ERROR:', error);
    throw error;
  }
};

export const getSummary = async (sessionId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Summary/${sessionId}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

 
    return response.data?.data ?? null;
  } catch (error) {
    console.error('❌ getSummary API ERROR:', error);
    return null;
  }
};
