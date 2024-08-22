import io from 'socket.io-client';
import { AuthContext } from './context/AuthContext';


const socket = io('http://localhost:5000', {
    query: { userId: localStorage.getItem('userId') } // Send userId directly
});

export default socket;
