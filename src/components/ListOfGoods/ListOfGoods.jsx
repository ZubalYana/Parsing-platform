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
    })

    const setFollow = async (id) => {
        try{
            const response = await axios.post(`http://localhost:3000/follow`, {id});
            console.log(response.data)

        }catch{
            console.error('Error');
        }
    }

    const getUpdate = async (url) => {
        try{
            const response = await axios.post(`http://localhost:3000/getUpdate`, {id});
            console.log(response.data)
        }catch{
            console.error('Error');
        }
    }

  return (
    <div className='goodsContainer'>
        {goods.map((item, index) => (
            <div className='goodsItem' key={index}>
                <p>{item.title}</p>
                <p>{item.price}</p>
                <p>{item.status ? 'Available' : 'Not available'}</p>
                <a href={item.url} className='viewBtn' >View</a>
                <button onClick={() => setFollow(item._id)}>
                    {item.follow ? 'Unfollow' : 'Follow'}
                </button>
                <button onClick={() => getUpdate(item._id)}>Check update</button>
            </div>
        ))}
    </div>
  )
}
