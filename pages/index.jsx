import Layout from "@/components/Layout";
import { useSession } from "next-auth/react"
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from "@mui/x-charts";
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from "react";
import IconArrowUp from "@/components/Icons/IconArrowUp";
import IconArrowDown from "@/components/Icons/IconArrowDown";
import { CircularProgress, LinearProgress, Rating } from "@mui/material";
import axios from "axios";
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import Link from "next/link";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Category } from "@/models/Category";
import IconGear from "@/components/Icons/IconGear";
import InputLines from "@/components/InputLines";






export default function Home({orders, ordersNew, productsNew, categories}) {
  const { data: session } = useSession();
  
  // const [orders, setOrders] = useState();
  // const [categories, setCategories] = useState();

  const [profitForThisMonth, setProfitForThisMonth] = useState("20000");
  const [profitForLastMonth, setProfitForLastMonth] = useState("27000");
  const [percentProfit, setPercentProfit] = useState();
  
  
  const [clientsForThisMonth, setClientsForThisMonth] = useState("50");
  const [clientsForLastMonth, setClientsForLastMonth] = useState("60");
  const [percentClients, setPercentClients] = useState();

  const [profitGoal, setProfitGoal] = useState(300000);
  const [percentProfitGoal, setPercentProfitGoal] = useState(); 

  const [totalOrders, setTotalOrders] = useState("65");
  const [lastMonthOrders, setLastMonthOrders] = useState("80");
  const [percentOrders, setPercentOrders] = useState("50");

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ]

  const [nowMonth, setNowMonth] = useState();
  const [actualMonthSort, setActualMonthSort] = useState([]);
  const [monthsProfit, setMonthsProfit] = useState([]);

  const [profitForCurrentMonthForCategory, setProfitForCurrentMonthForCategory] = useState([]);

  const [categoriesName, setCategoriesName] = useState();
  
  const [selectedMonth, setSelectedMonth] = useState(11);
  
  const [editedProfitGoal, setEditedProfitGoal] = useState(false);

  const [editedProfitGoalValue, setEditedProfitGoalValue] = useState(0);



  useEffect(() => {
    processOrders(orders);
  },[selectedMonth])

  useEffect(() => {
		// axios.get('/api/categories').then(response => {
		// 	setCategories(response.data);

    //   processCategories(response.data);
       
      
		// });
    
    // axios.get('/api/orders').then(resp => {
    //   setOrders(resp.data);

    
    // });
    
    processOrders(orders);
    
 
	}, []) 

  

  function onlyDigits(value){
    if(value.length === 0){
      return true;
    }
    return "1234567890".indexOf(value.substr(value.length - 1)) !== -1
  }


  function changeProfitGoalValue(value){
    if (onlyDigits(value))
      setProfitGoal(value);
  }

  function editProfitGoal(){
    setEditedProfitGoal(!editedProfitGoal);
  }

  function processCategories(categories) {
    setCategoriesName(categories.map(p => p.name));
  }


  function processOrders(orders){


  


    // console.log("fffffffffffff");
    // console.log(orders);

    var today = new Date();
    var mmNow =  String(1900 + today.getYear()) + "-" + String(today.getMonth() + 1).padStart(2, '0');
    var mmLast =  String(1900 + today.getYear())+ "-" + String(today.getMonth() ).padStart(2, '0');
    // var mmNow = String(today.getMonth() + 1).padStart(2, '0');
    // var mmLast = String(today.getMonth() ).padStart(2, '0');


    let actualMonthSortTemp = [];
    var d = new Date();
    d.setDate(1);
    for (i=0; i<=11; i++) {
        monthNames[d.getMonth()] + ' ' + d.getFullYear();
        actualMonthSortTemp.push( d.getFullYear() + '-' + String(d.getMonth()+1 ).padStart(2, '0'));
        // actualMonthSortTemp.push(monthNames[d.getMonth()] + ' ' + d.getFullYear());

        d.setMonth(d.getMonth() - 1);
    }
    actualMonthSortTemp = actualMonthSortTemp.reverse();



    setNowMonth(monthNames[Number( actualMonthSortTemp[selectedMonth]?.substr(5,2) )-1]);
    setActualMonthSort(actualMonthSortTemp);

    // const actualMonthSortTemp = monthNames.slice(today.getMonth()+1, 12).concat( monthNames.slice(0, today.getMonth()+1) );



    const OrdersForMonth = {};
    for (var i = 0; i <= 11; i++) {
      OrdersForMonth[actualMonthSortTemp[i]] = orders.filter(p => p.createdAt.substr(0,7) === actualMonthSortTemp[i]);
    }


    

    const ProfitForMonth = {};
    let sumProfitForMonth = 0;
    for (var i = 0; i <= 11; i++) {
      sumProfitForMonth = 0;
      OrdersForMonth[actualMonthSortTemp[i]].map(p => p.line_items?.map( s => sumProfitForMonth += ( s.price_data.unit_amount / 100) * s.quantity ));
      ProfitForMonth[actualMonthSortTemp[i]] = sumProfitForMonth;
    }

    setMonthsProfit(Object.values(ProfitForMonth));


    // const OrdersForMonth[actualMonthSortTemp[11]] = orders.filter(p => p.createdAt.substr(0,7) === mmNow) ;
    // const OrdersForMonth[actualMonthSortTemp[10]] = orders.filter(p => p.createdAt.substr(0,7) === mmLast) ;


    let sumProfitForThisMonth = ProfitForMonth[actualMonthSortTemp[selectedMonth]];
    let sumProfitForLastMonth = ProfitForMonth[actualMonthSortTemp[selectedMonth - 1 ]];

    // OrdersForMonth[actualMonthSortTemp[11]].map(p => p.line_items.map( s => sumProfitForThisMonth += s.price_data.unit_amount ));
    // OrdersForMonth[actualMonthSortTemp[10]].map(p => p.line_items.map( s => sumProfitForLastMonth += s.price_data.unit_amount ));

    setProfitForThisMonth(sumProfitForThisMonth);
    setProfitForLastMonth(sumProfitForLastMonth);

    calculateProfit(sumProfitForThisMonth, sumProfitForLastMonth);


    const uniqueClientsForThisMonth = new Set( OrdersForMonth[actualMonthSortTemp[selectedMonth]]?.map(p => p.email) );
    const uniqueClientsForLastMonth = new Set( OrdersForMonth[actualMonthSortTemp[selectedMonth - 1]]?.map(p => p.email) );

    setClientsForThisMonth(uniqueClientsForThisMonth.size);
    setClientsForLastMonth(uniqueClientsForLastMonth.size);

    calculateClients(uniqueClientsForThisMonth.size, uniqueClientsForLastMonth.size);



    calculateProfitGoal(sumProfitForThisMonth, profitGoal);


    setTotalOrders(OrdersForMonth[actualMonthSortTemp[selectedMonth]]?.length);
    setLastMonthOrders(OrdersForMonth[actualMonthSortTemp[selectedMonth - 1]]?.length);

    calculateOrders(OrdersForMonth[actualMonthSortTemp[selectedMonth]]?.length, OrdersForMonth[actualMonthSortTemp[selectedMonth - 1 ]]?.length);



    const ProfitForMonthForCategory = [];
    let sumProfitForMonthForCategory = 0;
    for (var i = 0; i < categories.length; i++) {
      sumProfitForMonthForCategory = 0;
      OrdersForMonth[actualMonthSortTemp[selectedMonth]]?.map(p => p.line_items?.map( s => sumProfitForMonthForCategory += s.price_data.product_data.description === categories[i].name ? 
          ( s.price_data.unit_amount / 100) * s.quantity : 0 ));
      if(sumProfitForMonthForCategory > 0){
        ProfitForMonthForCategory.push( {id: i, value: sumProfitForMonthForCategory , label : categories[i].name} );
      }    
    }

    setProfitForCurrentMonthForCategory(ProfitForMonthForCategory);
    
  }



  function calculateProfit(sumProfitForThisMonth, sumProfitForLastMonth){
    const num = (sumProfitForThisMonth / sumProfitForLastMonth - 1)*100;
    setPercentProfit( num.toFixed(2) );
    // setPercentProfit( profit > lastMonthProfit ? (lastMonthProfit/profit - 1 )*100 :  (profit / lastMonthProfit - 1)*100 );
  }

  function calculateClients(uniqueClientsForThisMonthSize, uniqueClientsForLastMonthSize){
    const num = (uniqueClientsForThisMonthSize / uniqueClientsForLastMonthSize - 1)*100;
    setPercentClients( num.toFixed(2) );
    // setPercentProfit( profit > lastMonthProfit ? (lastMonthProfit/profit - 1 )*100 :  (profit / lastMonthProfit - 1)*100 );
  }

  function calculateProfitGoal(sumProfitForThisMonth, profitGoal){
    const num = ( sumProfitForThisMonth / profitGoal )*100;
    setPercentProfitGoal( num.toFixed(1) );
    // setPercentProfit( profit > lastMonthProfit ? (lastMonthProfit/profit - 1 )*100 :  (profit / lastMonthProfit - 1)*100 );
  }

  function calculateOrders(OrdersForThisMonthLength, OrdersForLastMonthLength){
    const num = ( OrdersForThisMonthLength / OrdersForLastMonthLength - 1 )*100;
    setPercentOrders( num.toFixed(2) );
    // setPercentProfit( profit > lastMonthProfit ? (lastMonthProfit/profit - 1 )*100 :  (profit / lastMonthProfit - 1)*100 );
  }



  const handleDownload = () => {
    const content = document.getElementById("content-to-download");

    if (!content) {
      console.error("Element not found!");
      return;
    }

    html2canvas(content, { scale: 3 }).then((canvas) => {
      const paddingTop = 50;
      const paddingRight = 50;
      const paddingBottom = 50;
      const paddingLeft = 50;

      const canvasWidth = canvas.width + paddingLeft + paddingRight;
      const canvasHeight = canvas.height + paddingTop + paddingBottom;

      const newCanvas = document.createElement("canvas");
      newCanvas.width = canvasWidth;
      newCanvas.height = canvasHeight;
      const ctx = newCanvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "#ffffff"; // Background color
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(canvas, paddingLeft, paddingTop);
      }

      const pdf = new jsPDF("l", "mm", "a4");
      const imgData = newCanvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("content.pdf");
    });
  };


  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Здравствуйте, <b>{session?.user?.name}.</b>
        </h2>
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          <img className="w-6 h-6" src={session?.user?.image} alt="" />
          
          <span className="px-2">
            {session?.user?.name}
          </span>
        </div>
      </div>


      <button  onClick={handleDownload}>
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg w-full ml-7 my-3 ">
          Скачать PDF
        </div>
      </button>

      <div id="content-to-download" className="mx-7 my-3">
        <div className="flex justify-between">

          <div className="bg-white px-4 py-5 rounded-lg shadow-lg w-full mr-4">
            <div className="">
              <div>
                Прибыль
              </div>
              
              <div className="font-bold text-xl">
                ₽{profitForThisMonth} 
              </div>
              ₽{profitForLastMonth}

              <div className="flex">
                <div className={"flex items-center " + (percentProfit < 0 ?'text-red-500':'text-green-500')}>
                   { percentProfit < 0 ? <IconArrowDown/> : <IconArrowUp/> }  { percentProfit }% 
                </div>
                <div className="ml-3">
                  С прошлого месяца
                </div>
              </div>

            </div>
            <div className="">

            </div>
          </div>


          <div className="bg-white px-4 py-5 rounded-lg shadow-lg w-full mr-4" >
            <div className="">
              <div>
                Клиенты
              </div>
              
              <div className="font-bold text-xl">
                {clientsForThisMonth}
              </div>
              {clientsForLastMonth}
              <div className="flex">
                <div className={"flex items-center " + (percentClients < 0 ?'text-red-500':'text-green-500')}>
                   { percentClients < 0 ? <IconArrowDown/> : <IconArrowUp/> }  { percentClients }% 
                </div>
                <div className="ml-3">
                  С прошлого месяца
                </div>
              </div>

            </div>
            <div className="">

            </div>
          </div>


          <div className="bg-white px-4 py-5 rounded-lg shadow-lg w-full mr-4 ">
            <div className="">
              <div className="flex justify-between">
                План продаж
                
                { selectedMonth === 11 &&
                  <button onClick={() => editProfitGoal()}>
                    <IconGear/>
                  </button>
                }
              </div>
              
              {editedProfitGoal &&

              

                <>
                
                  <input 
                    type="text"  
                    placeholder="Цель" 
                    value={profitGoal} onChange={ev => changeProfitGoalValue(ev.target.value)}
                    />

                  {/* <button 
                    className="btn-primary"
                    onClick={() => saveProfitGoal()}
                    >
                    Сохранить
                  </button> */}
                </>

                  ||
                <>
                  <div className="font-bold text-xl">
                    {percentProfitGoal}%
                  </div>
                  ₽{profitGoal}
                  <div className="mt-3">
                    <LinearProgress variant="determinate" value={Number( percentProfitGoal )} />              
                  </div>
                
                </>
               
              }



              

            </div>
            <div className="">

            </div>
          </div>


          <div className="bg-white px-4 py-5 rounded-lg shadow-lg w-full">
            <div className="">
              <div>
                Заказы
              </div>
              
              <div className="font-bold text-xl">
                {totalOrders}
              </div>
              {lastMonthOrders}
              <div className="flex">
                <div className={"flex items-center " + (percentOrders < 0 ?'text-red-500':'text-green-500')}>
                   { percentOrders < 0 ? <IconArrowDown/> : <IconArrowUp/> }  { percentOrders }% 
                </div>
                <div className="ml-3">
                  С прошлого месяца
                </div>
              </div>

            </div>
            <div className="">

            </div>
          </div>

        </div>

        <div className="flex mt-4 ">
          <div className="bg-white px-4 py-5 rounded-lg shadow-lg w-full mr-4">
            
        

            { monthsProfit.length > 0 && actualMonthSort.length > 0 &&
              
              <BarChart
                series={[

                  { data: monthsProfit, label: 'Прибыль'  },
                  // { data: [51000, 6000, 49000, 30000, 6000, 49000, 30000, 6000, 49000, 30000, 6000, 49000], label: 'План продаж' },
                  // { data: [51000, 6000, 49000, 30000, 6000, 49000, 30000, 6000, 49000, 30000, 6000, 49000], label: 'fffff' },
                ]}
                height={290}
                onItemClick={(event, d) => setSelectedMonth(d.dataIndex)}
                xAxis={[{ data: actualMonthSort, scaleType: 'band' }]}
                margin={{ top: 10, bottom: 30, left: 70, right: 10 }}
              />

              
            }


          </div>

          <div className="bg-white px-4 py-5 rounded-lg shadow-lg ">

            <div className="text-lg">
              Объемы продаж  
            </div>  

            <PieChart
              series={[
                { 
                  data: profitForCurrentMonthForCategory,
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                  startAngle: -180,
                  endAngle: 180,
                  cx: 150,
                  cy: 120,
                }
              ]}
              width={380}
              height={280}
            />
            
            <div className="text-center text-xl">
              {nowMonth}
            </div>

          </div>


        </div>

        <div className="flex mt-4">
          <div className="bg-white px-4 py-5 rounded-lg shadow-lg w-1/2 mr-4">
            <div className="text-lg">
              Последние товары  
            </div>   



            <table className="basic mt-2">
              <thead>
                <tr>
                  {/* <td>Product name</td> */}
                  <td></td>
                  <td>Наименование товара</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {productsNew.map(product => (
                  <tr key={product._id}>
                    <td>
                    <div className=" h-16 w-16 bg-white shadow-sm rounded-sm border border-gray-200">
                      <img src={product.images[0]} alt="" className="rounded-lg"/>
                    </div>
                    </td>
                    <td>
                      {product.title}
                      { product.updatedAt &&
                        <div className="text-sm text-gray-500">
                          Последнее изменение  { product.updatedAt?.substr(0,10)}
                        </div>

                      }
                    </td>
                    <td>
                      <Link className="btn-default" href={'/products/edit/'+product._id}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                        {/* Edit */}
                      </Link>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table> 

          </div>


          <div className="bg-white px-4 py-5 rounded-lg shadow-lg w-full ">
              <div className="text-lg">
                Последние заказы
              </div>

              <div>

                <table className="basic">
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Оплата</th>
                      <th>Заказчик</th>
                      <th>Товары</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersNew.length > 0 && ordersNew.map(order => (
                      <tr key={order._id}>
                        <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                        <td className={order.paid ? 'text-green-600' : 'text-red-600' }>
                          {order.paid? "ДА" : "НЕТ"}
                       
                        </td>
                        <td>
                          {order.name} {order.email}<br/>
                          {order.city} {order.postalCode} {order.country}<br/> 
                          {order.streetAddress}
                        </td>
                        <td>
                          {order.line_items.map(l => (
                            <div key={l.price_data?.product_data?.name}>
                              {l.price_data?.product_data?.name} | {l.quantity}шт. | ₽{(l.price_data?.unit_amount / 100) * l.quantity}                   

                              {/* {l.price_data?.product_data?.name} x {l.quantity}<br/>                     */}
                            </div>
                          ))}
                        </td>
                        <td>
                          {order.statusOrder}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>


              </div>

          </div>


        </div>





       {/* <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
          },      
        ]}
        width={500}
        height={300}
      /> */}






      </div>

    </Layout>
  )
}


export async function getServerSideProps() {
  await mongooseConnect();
  const ordersNew = await Order.find({}, null, { sort: {'createdAt': -1}, limit: 5 });
  const orders = await Order.find({}, null, {sort: {'_id': -1}});
  // const productsNew = await Product.find({}, null, {sort: {'updatedAt': 1} , limit: 5 });
  const productsNew = await Product.find({}, null, {sort: {'createdAt': -1} , limit: 5 });
  const categories = await Category.find({}, null, {});

  return {
    props: {
      ordersNew: JSON.parse(JSON.stringify(ordersNew)),
      orders: JSON.parse(JSON.stringify(orders)),
      productsNew: JSON.parse(JSON.stringify(productsNew)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };

}