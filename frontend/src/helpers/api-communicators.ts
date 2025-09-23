import axiosInstance, { baseUrl } from "./Axios";

export const loginUser = async (email: string, password: string) => {
  const res = await axiosInstance.post("/user/login", { email, password });
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  const data = await res.data;
  return data;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await axiosInstance.post("/user/signup", {
    name,
    email,
    password,
  });
  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }
  const data = await res.data;
  return data;
};

export const checkAuthStatus = async () => {
  const res = await axiosInstance.get("/user/auth-status");
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  const data = await res.data;
  return data;
};

export const sendChatRequest = async (
  message: string,
  onChunk: (chunk: string) => void
) => {
  const response = await fetch(`${baseUrl}/chat/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // keep cookies/JWT
    body: JSON.stringify({ message }),
  });

  if (!response.body) return;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value));
  }
};

export const getUserChats = async () => {
  const res = await axiosInstance.get("/chat/all-chats");
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  const data = await res.data;
  return data;
};

export const deleteUserChats = async () => {
  const res = await axiosInstance.delete("/chat/delete");
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  const data = await res.data;
  return data;
};

export const logoutUser = async () => {
  const res = await axiosInstance.get("/user/logout");
  if (res.status !== 200) {
    throw new Error("Unable to Logout");
  }
  const data = await res.data;
  return data;
};
