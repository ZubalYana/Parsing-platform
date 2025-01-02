import React, { useState, useEffect } from 'react'
import './ListOfGoods.css'
import axios from 'axios'
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
    

  return (
    <div className='goodsContainer'>
        {goods.map((item, index) => (
            <div className='goodsItem' key={index}>
                <p className='itemTitle'>{item.title}</p>
                <p className='itemPrice'>{item.price}</p>
                <p>{item.status ? 'Available' : 'Not available'}</p>
                <a target='_blank' href={item.url} className='viewBtn' >View</a>
                <div className="itemButtons">
                <button onClick={() => setFollow(item._id)}>
                    {item.follow ? 'Unfollow' : 'Follow'}
                </button>
                <button onClick={() => getUpdate(item.url)}>Check update</button>
                </div>
            </div>
        ))}
    </div>
  )
}
