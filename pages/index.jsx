import Layout from "@/components/Layout";
import { useSession } from "next-auth/react"
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from "@mui/x-charts";
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from "react";
import IconArrowUp from "@/components/Icons/IconArrowUp";
import IconArrowDown from "@/components/Icons/IconArrowDown";
import { LinearProgress } from "@mui/material";
import axios from "axios";






export default function Home() {
  const { data: session } = useSession();
  
  const [orders, setOrders] = useState();

  const [profitForThisMonth, setProfitForThisMonth] = useState("20000");
  const [profitForLastMonth, setProfitForLastMonth] = useState("27000");
  const [percentProfit, setPercentProfit] = useState();
  
  
  const [clientsForThisMonth, setClientsForThisMonth] = useState("50");
  const [clientsForLastMonth, setClientsForLastMonth] = useState("60");
  const [percentClients, setPercentClients] = useState();

  const [profitGoal, setProfitGoal] = useState("300000");
  const [percentProfitGoal, setPercentProfitGoal] = useState(); 

  const [totalOrders, setTotalOrders] = useState("65");
  const [lastMonthOrders, setLastMonthOrders] = useState("80");
  const [percentOrders, setPercentOrders] = useState();

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ]

  const [nowMonth, setNowMonth] = useState();
  const [actualMonthSort, setActualMonthSort] = useState();
  const [monthsProfit, setMonthsProfit] = useState();



  

  useEffect(() => {
		axios.get('/api/orders').then(response => {
			setOrders(response.data);

      processOrders(response.data);

		});



	}, []) 

  function processOrders(orders){



    console.log("fffffffffffff");
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



    setNowMonth(monthNames[today.getMonth()]);
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
      OrdersForMonth[actualMonthSortTemp[i]].map(p => p.line_items?.map( s => sumProfitForMonth += s.price_data.unit_amount ));
      ProfitForMonth[actualMonthSortTemp[i]] = sumProfitForMonth;
    }

    setMonthsProfit(Object.values(ProfitForMonth));





    // const OrdersForMonth[actualMonthSortTemp[11]] = orders.filter(p => p.createdAt.substr(0,7) === mmNow) ;
    // const OrdersForMonth[actualMonthSortTemp[10]] = orders.filter(p => p.createdAt.substr(0,7) === mmLast) ;


    let sumProfitForThisMonth = ProfitForMonth[actualMonthSortTemp[11]];
    let sumProfitForLastMonth = ProfitForMonth[actualMonthSortTemp[10]];

    // OrdersForMonth[actualMonthSortTemp[11]].map(p => p.line_items.map( s => sumProfitForThisMonth += s.price_data.unit_amount ));
    // OrdersForMonth[actualMonthSortTemp[10]].map(p => p.line_items.map( s => sumProfitForLastMonth += s.price_data.unit_amount ));

    setProfitForThisMonth(sumProfitForThisMonth);
    setProfitForLastMonth(sumProfitForLastMonth);

    calculateProfit(sumProfitForThisMonth, sumProfitForLastMonth);


    const uniqueClientsForThisMonth = new Set( OrdersForMonth[actualMonthSortTemp[11]].map(p => p.email) );
    const uniqueClientsForLastMonth = new Set( OrdersForMonth[actualMonthSortTemp[10]].map(p => p.email) );

    setClientsForThisMonth(uniqueClientsForThisMonth.size);
    setClientsForLastMonth(uniqueClientsForLastMonth.size);

    calculateClients(uniqueClientsForThisMonth.size, uniqueClientsForLastMonth.size);



    calculateProfitGoal(sumProfitForThisMonth, profitGoal);


    setTotalOrders(OrdersForMonth[actualMonthSortTemp[11]].length);
    setLastMonthOrders(OrdersForMonth[actualMonthSortTemp[10]].length);

    calculateOrders(OrdersForMonth[actualMonthSortTemp[11]].length, OrdersForMonth[actualMonthSortTemp[10]].length);



    console.log(clientsForLastMonth); 
  
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


      <div className="m-10">
        <div className="flex justify-between">

          <div className="bg-white px-4 py-5 rounded-lg shadow-lg w-full mr-4">
            <div className="">
              <div>
                Прибыль
              </div>
              
              <div className="font-bold text-xl">
                ₽{profitForThisMonth}
              </div>

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
              <div>
                План продаж
              </div>
              
              <div className="font-bold text-xl">
                {percentProfitGoal}%
              </div>
              
              <div className="mt-3">
                <LinearProgress variant="determinate" value={percentProfitGoal} />
              </div>


              

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
            <BarChart
              series={[
                { data: monthsProfit, label: 'Прибыль'  },
                // { data: [51000, 6000, 49000, 30000, 6000, 49000, 30000, 6000, 49000, 30000, 6000, 49000], label: 'План продаж' },
              ]}
              // height={290}
              
              xAxis={[{ data: actualMonthSort, scaleType: 'band' }]}
              margin={{ top: 10, bottom: 30, left: 70, right: 10 }}
            />

          </div>

          <div className="bg-white px-4 py-5 rounded-lg shadow-lg ">

            <div className="text-lg">
              Объемы продаж  
            </div>  

            <PieChart
              series={[
                { 
                  data: [
                    { id: 0, value: 10, label: 'Брус' },
                    { id: 1, value: 15, label: 'Доска' },
                    { id: 2, value: 20, label: 'Ящик' },
                  ],
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
          <div className="bg-white px-4 py-5 rounded-lg shadow-lg w-full mr-4">
            <div className="text-lg">
              Последние товары  
            </div>    

          </div>


          <div className="bg-white px-4 py-5 rounded-lg shadow-lg w-full ">
              <div className="text-lg">
                Последние заказы
              </div>

              <div>

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


