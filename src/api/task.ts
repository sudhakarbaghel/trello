import axios from "../config/axios";

interface CreateTaskPayload {
  title: string;
  description: string;
  dueDate: string;
}

interface UpdateTaskPayload extends CreateTaskPayload {
  id: string;
}

export const createTask = async (payload: CreateTaskPayload) => {
  const response = await axios.post("/tasks", payload);
  return response.data;
};

export const updateTask = async (payload: UpdateTaskPayload) => {
  const { id, ...taskData } = payload;
  const response = await axios.put(`/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await axios.delete(`/tasks/${id}`);
  return response.data;
};
export const fetchTasks = async () => {
  const response = await axios(`/tasks`);
  return response.data;
};
