import React, { useState } from 'react';
import './AdminInput.css';
import axios from 'axios';

export default function AdminInput({ onAddGood }) {
    const [searchName, setSearchName] = useState('');

    const handleSend = async () => {
        try {
            const response = await axios.post('http://localhost:3000/goodsTargetName', { URL: searchName });
            alert(`Data fetched successfully: ${response.data.message}`);
            onAddGood();
            setSearchName(''); 
        } catch (error) {
            console.error('Error fetching or logging data:', error);
            alert('Error fetching or logging data');
        }
    };

    return (
        <div className="adminForm">
            <input
                type="text"
                placeholder="URL"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}
