// Desc: API calls to backend

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const URL = `${BASE_URL ? BASE_URL : ""}/api/v1`;
const AUTH_URL = `${URL}/auth`;

const login = async (email, password) => {
  const userData = { email, password };
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return data;
};

//register function
const register = async (name, email, password) => {
  const userData = { name, email, password };
  const response = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return data;
};

const logout = async () => {
  // remove token from local storage
  localStorage.removeItem("token");
  // remove user from state
  localStorage.removeItem("username");
  window.location.reload(false);
};

const createGame = async (token, color) => {
  const response = await fetch(`${URL}/game`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ color }),
  });
  if(response.status===401) {
    logout();
  }
  return response;
};

const joinGame = async (token, gameID) => {
  const response = await fetch(`${URL}/game/${gameID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
  if(response.status===401) {
    logout();
  }
  const playerDetails = await response.json();
  return playerDetails;
};

export { login, register, logout, createGame, joinGame };
