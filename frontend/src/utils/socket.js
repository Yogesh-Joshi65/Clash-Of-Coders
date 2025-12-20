import { io } from 'socket.io-client';

// Replace with your actual backend URL
const BACKEND_URL = "http://localhost:5000"; 

export const socket = io(BACKEND_URL, {
    autoConnect: false,
    transports: ['websocket'] 
});