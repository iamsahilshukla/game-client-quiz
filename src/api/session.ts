export interface Session {
  roomId: string;
  questions: any[];
}

const API_URL = 'https://donkeyquizgame.onrender.com/api';

export const createSession = async (
  questionIds: string[]
): Promise<Session> => {
  const response = await fetch(`${API_URL}/session/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionIds }),
  });
  return response.json();
};
