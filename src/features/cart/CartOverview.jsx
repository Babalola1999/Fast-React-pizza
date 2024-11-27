import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalCartPrice } from "./cartSlice";

function CartOverview() {
  //Note react redux recommends that we place the fuction inside our useSelector into our slife and then export it,
  //the exported name must start with (get) this is a convention stated by redux 
  //const totalCartQuantity =useSelector(state=>state.cart.cart.reduce((sum,item)=>sum + item.quantity, 0))
  const totalCartQuantity =useSelector(getTotalCartPrice)
  return (
    <div className="bg-stone-800 text-stone-200 uppercase py-4 px-4 
     text-sm md:text-base sm:px-6 flex items-center justify-between">
      <p className="text-stone-300 font-semibold space-x-4 sm:space-x-6">
        <span>{totalCartQuantity}</span>
        <span>$23.45</span>
      </p>
      <Link to="cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
