import { createSlice } from "@reduxjs/toolkit"

const initialState={
    cart:[{
        pizzaId:12,
        name:"mediterranean",
        quantity:2,
        unitPrice:16,
        TotalPrice:32
    }],
}
const cartSlice=createSlice({
    name:"cart",initialState,
    reducers:{
        addItem(state,action){
        //payload=newItem payload is what we pass inside the action creator
        state.cart.push(action.payload)
        },
        deleteItem(state,action){
        //payload=pizzaId
        state.cart=state.cart.filter(item=> item.pizzaId !==action.payload)        },
        increaseItemQuantity(state,action){
        //payload=pizzaId
        const item = state.cart.find(item=>item.pizzaId=== action.payload)

        item.quantity++
        item.TotalPrice=item.quantity * item.unitPrice
        },
        decreaseItemQuantity(state,action){
         //payload=pizzaId
         const item=state.cart.filter(item=> item.pizzaId !==action.payload)
    
         item.quantity--
         item.TotalPrice=item.quantity * item.unitPrice
        },
        clearCart(state){
        state.cart=[]
        },
    }
})

export const {addItem,deleteItem,increaseItemQuantity,decreaseItemQuantity,clearCart}=cartSlice.actions
export default cartSlice.reducer