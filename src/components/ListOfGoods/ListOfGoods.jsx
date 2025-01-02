import React, { useState, useEffect } from 'react'
import './ListOfGoods.css'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faTrashCan, faSquareCheck, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

export default function ListOfGoods() {
    const [goods, setGoods] = useState([]);
    const getGoods = () => {
        axios.get('http://localhost:3000/items')
        .then(res => {
            console.log(res);
            setGoods(res.data);
        })
    }
    useEffect(() => {
        getGoods();
    }, [])

    const setFollow = async (id) => {
        try{
            const response = await axios.post(`http://localhost:3000/follow`, {id});
            console.log(response.data)

        }catch{
            console.error('Error');
        }
    }

    const getUpdate = async (url) => {
        try {
            const response = await axios.post('http://localhost:3000/getUpdate', { url });
            console.log(response.data);
            getGoods();
        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(() => {
        getGoods();
    }, []); 

    const deleteItem = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3000/deleteItem/${id}`);
            console.log(response.data);
            getGoods();
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

  return (
    <div className='goodsContainer'>
        {goods.map((item, index) => (
            <div className='goodsItem' key={index}>
                <div className="itemImgContainer">
                  <img src={item.image} alt={item.title} className='itemImage' />
                </div>
                <p className='itemTitle'>{item.title}</p>
                <p className='itemPrice'>{item.price}</p>
                <p>{item.status ? 'Available' : 'Not available'}</p>
                <a target='_blank' href={item.url} className='viewBtn' >
                    <FontAwesomeIcon icon={faPaperclip} style={{marginRight: '5px'}} /> View
                </a>
                <div className="itemButtons">
                <button onClick={() => setFollow(item._id)}>
                    {item.follow ? <FontAwesomeIcon icon={faMinus} style={{marginRight: '5px'}} /> : <FontAwesomeIcon icon={faPlus} style={{marginRight: '5px'}} />}
                    {item.follow ? 'Unfollow' : 'Follow'}
                </button>
                <button onClick={() => getUpdate(item.url)}>
                    <FontAwesomeIcon icon={faSquareCheck} style={{marginRight: '5px'}} /> Check update
                </button>
                <button onClick={() => deleteItem(item._id)} className='deleteBtn'>
                    <FontAwesomeIcon icon={faTrashCan} style={{marginRight: '5px'}} /> Delete item
                </button>
                </div>
            </div>
        ))}
    </div>
  )
}
