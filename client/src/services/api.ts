const API_BASE_URL = 'http://localhost:3000/api';

export const uploadImage = async (file: File, type: 'user' | 'clothing'): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/upload/${type}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Image upload failed');
  }

  const data = await response.json();
  return data.imageUrl;
};

export const createTryOnSession = async (userImageUrl: string, clothingImageUrl: string[]) => {
  const response = await fetch(`${API_BASE_URL}/try-on`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userImageUrl,
      clothingImageUrl,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create try-on session');
  }

  return response.json();
};

export const continueTryOnSession = async (sessionId: string, clothingImageUrl: string[]) => {
  const response = await fetch(`${API_BASE_URL}/try-on/${sessionId}/continue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clothingImageUrl,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to continue try-on session');
  }

  return response.json();
};

export const getAllSessions = async () => {
  const response = await fetch(`${API_BASE_URL}/try-on`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch sessions');
  }

  return response.json();
};
