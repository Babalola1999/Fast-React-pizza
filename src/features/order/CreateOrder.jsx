//import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store"
import { formatCurrency } from "../../utils/helpers";
import { useState } from "react";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );



function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData();
  const dispatch = useDispatch()
  const {username,status:addressStatus,position,address,error:errorAddress} =useSelector(state=>state.user)
  const isLoadingAddress=addressStatus==="loading"
  const cart = useSelector(getCart);
  const totalCartPrice=useSelector(getTotalCartPrice)
  const priorityPrice= withPriority ? totalCartPrice * 0.2 : 0
  const totalPrice=totalCartPrice+priorityPrice;
  if(!cart.length) return <EmptyCart/>
  
  //console.log(isSubmitting);

  return (
    <div className="px-4 py-6 ">
      <h2 className="text-xl font-semibold mb-8">Ready to order? Let's go!</h2>
      
      {/*<Form method="POST" action="order/new">*/}
      <Form method="POST">
        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center ">
          <label className="sm:basis-40">First Name</label>
          <input  className="input grow" type="text" name="customer" defaultValue={username} required />
        </div>

        <div  className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center ">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input   className="input w-full" type="tel" name="phone" required />
          {formErrors?.phone && <p className="text-xs mt-2 text-red-700 bg-red-100 p-2 rounded-md">{formErrors.phone}</p>}
          </div>
        </div>

        <div  className=" relative mb-5 flex gap-2 flex-col sm:flex-row sm:items-center ">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input  className="input w-full"  type="text"  disabled={isLoadingAddress}  
            defaultValue={address} name="address" required />     
            {addressStatus==="error" && 
            <p className="text-xs mt-2 text-red-700 bg-red-100 p-2 rounded-md">{errorAddress}</p>}   
          </div>
          {!position.latitude && !position.longitude &&
          <span className="absolute top-[35px] right-[3px] z-50  md:right[5px]  md:top-[7px]"><Button  disabled={isLoadingAddress} type="small"   
            onClick={(e)=>{
              e.preventDefault()
            dispatch(fetchAddress())}}>Get position</Button></span>}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
          className="h-6 w-6 accent-yellow-400  focus:outline-none focus:ring focus:ring-yellow-400 
          focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button  type="primary"  disabled={isSubmitting || isLoadingAddress} >
            {isSubmitting ? "Placing Order ...." : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(formData);
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number,we might need it to contact you";
  if (Object.keys(errors).length > 0) return errors;
  const newOrder = await createOrder(order);
  //Do not overuse because it reduces performance,the reason why we are importing store is because you cant use
  //useSelector outside  a componenent,so to still achieve the same purpose as useSelector we did this below
  store.dispatch(clearCart())
  return redirect(`/order/${newOrder.id}`);
  //console.log(order);
  //if everything is okay create new order and redirect
  
}
export default CreateOrder;
