// src/common/storage.js

const storeInLocal = (key, value) => {
  return localStorage.setItem(key, value);
};

const lookInLocal = (key) => {
  return localStorage.getItem(key); 
};

const removeFromLocal = (key) => {
  return localStorage.removeItem(key);
};

// Functions for sessionStorage (optional, if you still need them)
const storeInSession = (key, value) => {
  return sessionStorage.setItem(key, value);
};

const lookInSession = (key) => {
  return sessionStorage.getItem(key); 
};

const removeFromSession = (key) => {
  return sessionStorage.removeItem(key);
};

// Logout function for localStorage
const logOutUser = () => {
  localStorage.clear();
};

export { storeInLocal, lookInLocal, removeFromLocal, logOutUser, storeInSession, lookInSession, removeFromSession };
