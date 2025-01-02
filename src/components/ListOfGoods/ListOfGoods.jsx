import React, { useState, useEffect } from 'react';
import './ListOfGoods.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faTrashCan, faSquareCheck, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

export default function ListOfGoods({ refreshGoods }) {
    const [goods, setGoods] = useState([]);

    const getGoods = () => {
        axios.get('http://localhost:3000/items')
            .then(res => setGoods(res.data.reverse()))
            .catch(error => console.error('Error fetching goods:', error));
    };

    useEffect(() => {
        getGoods();
    }, [refreshGoods]);

    const toggleFollow = async (id) => {
        try {
            const response = await axios.post('http://localhost:3000/follow', { id });
            const updatedItem = response.data;
            setGoods(prevGoods =>
                prevGoods.map(item =>
                    item._id === updatedItem._id ? { ...item, follow: updatedItem.follow } : item
                )
            );
        } catch (error) {
            console.error('Error toggling follow:', error);
        }
    };

    const getUpdate = async (url) => {
        try {
            const response = await axios.post('http://localhost:3000/getUpdate', { url });
            console.log(response.data);
            getGoods();
        } catch (error) {
            console.error('Error fetching update:', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/deleteItem/${id}`);
            setGoods(prevGoods => prevGoods.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div className='goodsContainer'>
            {goods.map(item => (
                <div className='goodsItem' key={item._id}>
                    <div className="itemImgContainer">
                        <img src={item.image} alt={item.title} className='itemImage' />
                    </div>
                    <p className='itemTitle'>{item.title}</p>
                    <p className='itemPrice'>{item.price}</p>
                    <p>{item.status ? 'Available' : 'Not available'}</p>
                    <a target='_blank' rel='noopener noreferrer' href={item.url} className='viewBtn'>
                        <FontAwesomeIcon icon={faPaperclip} style={{ marginRight: '5px' }} /> View
                    </a>
                    <div className="itemButtons">
                        <button onClick={() => toggleFollow(item._id)}>
                            <FontAwesomeIcon icon={item.follow ? faMinus : faPlus} style={{ marginRight: '5px' }} />
                            {item.follow ? 'Unfollow' : 'Follow'}
                        </button>
                        <button onClick={() => getUpdate(item.url)} style={{ marginRight: '20px' }}>
                            <FontAwesomeIcon icon={faSquareCheck} style={{ marginRight: '5px' }} /> Check update
                        </button>
                        <button onClick={() => deleteItem(item._id)} className='deleteBtn'>
                            <FontAwesomeIcon icon={faTrashCan} style={{ marginRight: '5px' }} /> Delete item
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
