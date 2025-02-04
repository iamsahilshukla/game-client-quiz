export interface Question {
  _id?: string;
  text: string;
  options: string[];
  correctAnswer: string;
  timeLimit: number;
  points: number;
}

const API_URL = 'https://donkeyquizgame.onrender.com/api';

export const getQuestions = async (): Promise<Question[]> => {
  const response = await fetch(`${API_URL}/admin/questions`);
  return response.json();
};

export const createQuestion = async (question: Partial<Question>) => {
  const response = await fetch(`${API_URL}/admin/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question),
  });
  return response.json();
};

export const updateQuestion = async (
  id: string,
  question: Partial<Question>
) => {
  const response = await fetch(`${API_URL}/admin/questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question),
  });
  return response.json();
};

export const deleteQuestion = async (id: string) => {
  const response = await fetch(`${API_URL}/admin/questions/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};
