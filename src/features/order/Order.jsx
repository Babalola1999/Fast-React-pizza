// Test ID: IIDSAT

import { useFetcher, useLoaderData } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";
import OrderItem from "./OrderItem";
import { useEffect } from "react";
import UpdateOrder from "./UpdateOrder";

function Order() {
  const order = useLoaderData();
  const fetcher=useFetcher()
  useEffect(function(){
    if(!fetcher.data && fetcher.state==="idle")
fetcher.load("/menu")
    console.log(fetcher)
  },[fetcher])
  //The reason why we are using this is to load the menu data so that we can associate the ingredient to each of the differnt pizza. 
  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address,
  // these are only for the restaurant staff
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  //console.log(order)
  
  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="py-6 px-4 space-y-8">
      <div className="flex items-center justify-between flex-wrap space-x-2">
        <h2 className="text-xl font-semibold"> Order # {id} status</h2>

        <div className="space-x-2">
          {priority && <span className="bg-red-500 py-1 px-3 text-sm
           font-semibold uppercase text-red-50 tracking-wide 
           rounded-full ">Priority</span>}
          <span className="bg-green-500 py-1 px-3 text-sm 
          font-semibold uppercase text-green-50 tracking-wide 
          rounded-full ">{status} order</span>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap space-x-2 bg-stone-200 px-6 py-5" >
        <p className="font-medium ">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className="text-xs text-stone-500">(Estimated delivery: {formatDate(estimatedDelivery)})</p>
      </div>

      
      <ul className="divide-y divide-stone-200 border-b border-t ">{cart.map((item) => <OrderItem item={item} 
      key={item.pizzaId} 
      ingredients={fetcher?.data?.find(el=>el.id===item.pizzaId)?.ingredients ?? []}
      isLoadingIngredients={fetcher.state==="loading"}/>)}</ul>
      <div className=" space-y-2 bg-stone-200 py-5 px-6">
        <p className="font-medium text-sm text-stone-600">Price pizza: {formatCurrency(orderPrice)}</p>
        {priority && <p className="font-medium text-sm text-stone-600">Price priority: {formatCurrency(priorityPrice)}</p>}
        <p className="font-bold text-sm text-stone-600">To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}</p>
      </div>
      {!priority&& <UpdateOrder order={order}/>}
    </div>
  );
}
export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  return order;
}

export default Order;
