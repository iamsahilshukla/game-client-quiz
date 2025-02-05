import { io } from 'socket.io-client'; // Import the socket.io client library

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:9000/';

export const socket = io(URL, { transports: ['websocket'] });
