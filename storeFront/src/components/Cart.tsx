import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { useQuery } from "urql";

//Order is currently being timestamped when the first item is added to cart.
    // Should be stamped when order is submitted.

export default function Cart() {
    const cart = useSelector((state: RootState) => state.cart.cart);

    

    return (
        <div className="position-relative">
                <h3>Shopping Cart</h3>
                <small>items in cart: {cart.items.length}</small>
            <div className="shopping-cart-container">
                <hr/>
                {cart.items.map(item=> {                        
                return (
                <>
                <div className="cart-item">
                    <div className="item-image">
                        <img src={`../../src/assets/${item.image}.jpg`} alt={item.image}/>
                    </div>
                    <div className="item-center">
                        <h2 className="item-name">{item.item}</h2>
                        <div className="item-qty">Quantity: {item.amount} Total: ${item.price * item.amount}</div>
                    </div>
                    <div className="item-price">Price: ${item.price}</div>
                </div>
                <hr/>
                </>
                )})}
                <div className="cart-footer">
                    <div>Total: ${cart.total}</div>
                </div>
            </div>
        </div>
    )
}