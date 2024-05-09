import IconConfirm from "@/components/Icons/IconConfirm";
import IconEdit from "@/components/Icons/IconEdit";
import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage(){
  const [orders, setOrders] = useState([]);
  
  const [statusOrderSel, setStatusOrderSel] = useState("В сборке");
  const [editOrder, setEditOrder] = useState("");
  
  const [title, setSearchTitle] = useState("");
  const [selectedSort, setSelectedSort] = useState("date");
  const [selectedSortVect, setSelectedSortVect] = useState("-1");

  useEffect(() => {
    fetchOrders();
  },[title])

  useEffect(() => {
    fetchOrders();
  },[selectedSort])

  useEffect(() => {
    fetchOrders();
  },[selectedSortVect])




  useEffect(() => {
    fetchOrders();
  }, []);

  
  
  function fetchOrders(){
    axios.get('/api/orders?title='+title+'&sort='+selectedSort+'&sortVect='+selectedSortVect).then(response => {
      setOrders(response.data);
    });
  }


  async function saveOrder(order){



    const data = {
      name: order.name, email: order.email, city: order.city, postalCode : order.postalCode, 
      streetAddress : order.streetAddress, country : order.country, houseNumber: order.houseNumber, 
      line_items: order.line_items, statusOrder: statusOrderSel, _id : order._id
    };
    
    
    await axios.put('/api/orders', data);


    fetchOrders();
  }

  function toEditOrder(order){
    setStatusOrderSel(order.statusOrder);
    setEditOrder(order);
  }

  return (
    <Layout>
      <h1>Заказы</h1>

      <input type="text" placeholder="Поиск" value={title} name="searchTitle" onChange={ev => setSearchTitle(ev.target.value)}/>
      <div className="flex ">
        <div>
          Сортировать по 
        </div>
        <select 
          className="w-1/12 mx-5"
          value={selectedSort}
          onChange={ev => setSelectedSort(ev.target.value)}
        >
          <option value="date">дате</option>
          <option value="paid">оплате</option>
          <option value="clientInfo">заказчику</option>
          <option value="statusOrder">статусу</option>
        </select>
        <select 
          className="w-40"
          value={selectedSortVect}
          onChange={ev => setSelectedSortVect(ev.target.value)}
        >
          <option value="-1">по убыванию</option>
          <option value="1">по возростанию</option> 
        </select>
      </div>


      <div>

        { editOrder === "" ?  "Дата и время" : (new Date(editOrder.createdAt)).toLocaleString()}

        <select 
          value={statusOrderSel}
          onChange={ev => setStatusOrderSel(ev.target.value)}
        >
          <option value="В сборке">В сборке</option>
          <option value="В пути">В пути</option> 
          <option value="Доставлено">Доставлено</option> 
        </select>

        
        <button onClick={() => saveOrder(editOrder)} className="btn-primary flex">
          Сохранить 
        </button>
        
      </div>

      <table className="basic">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Оплата</th>
            <th>Заказчик</th>
            <th>Товары</th>
            <th>Статус</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 && orders.map(order => (
            <tr>
              <td>{(new Date(order.createdAt)).toLocaleString()}</td>
              <td className={order.paid ? 'text-green-600' : 'text-red-600' }>
                {order.paid? "ДА" : "НЕТ"}
                {console.log(order)}
              </td>
              <td>
                Имя: {order.name}<br/> 
                Почта: {order.email}<br/>
                Адрес: {order.postalCode}, {order.country} г.{order.city} ул.{order.streetAddress} д. {order.houseNumber}  <br/> 
                
              </td>
              <td>
                {order.line_items.map(l => (
                  <>
                    {l.price_data?.product_data?.name} | {l.quantity}шт. | ₽{(l.price_data?.unit_amount / 100) * l.quantity} <br/>                    
                  </>
                ))}
              </td>
              <td>

                {order.statusOrder}
              </td>

              <td>
                <button onClick={() => toEditOrder(order)} className="btn-default">
                  <IconEdit/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}