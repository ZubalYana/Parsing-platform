import './App.css'
import AdminInput from './components/AdminInput/AdminInput'
import ListOfGoods from './components/ListOfGoods/ListOfGoods'
import React from 'react';

function App() {
  const [refreshGoods, setRefreshGoods] = React.useState(0);

  const refresh = () => setRefreshGoods(refreshGoods + 1);
  return (
    <>
    <div className="wrap">
    <AdminInput onAddGood={refresh} />
    <ListOfGoods refreshGoods={refreshGoods} />
    </div>
    </>
  )
}

export default App
