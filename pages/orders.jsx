import IconConfirm from "@/components/Icons/IconConfirm";
import IconEdit from "@/components/Icons/IconEdit";
import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination';


export default function OrdersPage(){
  const [orders, setOrders] = useState([]);
  
  const [statusOrderSel, setStatusOrderSel] = useState("В сборке");
  const [editOrder, setEditOrder] = useState("");
  
  const [title, setSearchTitle] = useState("");
  const [selectedSort, setSelectedSort] = useState("date");
  const [selectedSortVect, setSelectedSortVect] = useState("-1");

  const [page, setPage] = useState(1);
  const [countProduct, setCountProduct] = useState(10);

	const handleChangePage = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    fetchOrders();
  },[page])

  
  useEffect(() => {
    fetchOrders();
  },[selectedSort])
  
  useEffect(() => {
    fetchOrders();
  },[selectedSortVect])
  
  useEffect(() => {
    fetchOrders();
  },[title])


  useEffect(() => {
    fetchOrders();
  }, []);

  
  
  function fetchOrders(){
    axios.get('/api/orders?title='+title+'&sort='+selectedSort+'&sortVect='+selectedSortVect+'&page='+page).then(response => {
      setOrders(response.data);
    });

    axios.get('/api/orders?title='+title+'&count='+1).then(response => {
      setCountProduct(response.data);
    });
  }


  async function saveOrder(order){


    const dataNotif = {
      order : order._id, email: order.email, watched: false, statusOrder: statusOrderSel,
    };
    

    const data = {
      name: order.name, email: order.email, city: order.city, postalCode : order.postalCode, 
      streetAddress : order.streetAddress, country : order.country, houseNumber: order.houseNumber, 
      line_items: order.line_items, statusOrder: statusOrderSel, _id : order._id
    };
    
    
    await axios.put('/api/orders', data);

    await axios.post('/api/notificationOrderStatusChange', dataNotif);


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
          <option value="createdAt">дате</option>
          <option value="paid">оплате</option>
          <option value="name">заказчику</option>
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
            <th>Код</th>
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
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{(new Date(order.createdAt)).toLocaleString()}</td>
              <td className={order.paid ? 'text-green-600' : 'text-red-600' }>
                {order.paid? "ДА" : "НЕТ"}
              </td>
              <td>
                Имя: {order.name}<br/> 
                Почта: {order.email}<br/>
                { order.postalCode && 
                  <>
                    Адрес: {order.postalCode}, {order.country} г.{order.city} ул.{order.streetAddress} д. {order.houseNumber}  <br/> 
                  </>
                  ||
                  <>
                    Самовывоз  <br/> 
                  </>
                }
                
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

      <div className="flex mt-5 justify-center ">
				<Pagination count={countProduct} page={page} onChange={handleChangePage} />
			</div>

    </Layout>
  )
}