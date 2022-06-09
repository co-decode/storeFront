import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { useQuery, useMutation } from "urql";
import { setCart, setShopping } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

//Order is currently being timestamped when the first item is added to cart.
// Should be stamped when order is submitted.

const SendOrder = `
        mutation($id: ID, $orders: [OrderInput]) {
            appendOrder(id:$id, orders: $orders) {
                id
                username
                orders {
                    id
                    date
                    total
                    items {
                        item
                        amount
                        price
                    }
                }
            }
        }
    `;

interface FinalisedItems {
  item: string;
  amount: number;
  price: number;
}
interface OrderItems {
  item: string;
  amount: number;
  price: number;
  image: string;
}

interface CartOrder {
  date: string;
  items: FinalisedItems[];
  total: number;
}

interface CartOrderWImage {
  date: string;
  items: OrderItems[];
  total: number;
}

export default function Cart() {
  const cart = useSelector((state: RootState) => state.cart.cart);
  const currentUser = useSelector(
    (state: RootState) => state.login.currentUser
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sendResult, sendOrder] = useMutation(SendOrder);


  useEffect(()=> {
    if (!cart.items[0].item) {
      navigate('/shop')
    }
  },[cart.items[0].item])

  const confirmOrder = (id: string, orders: CartOrder) => {
    const variables = { id, orders };
    sendOrder(variables).then((result) =>
      result.error ? console.error(result.error) : null
    );
  };

  const handlePurchase = () => {
    const { date, total } = cart;
    const newItems = cart.items.map(
      (obj: FinalisedItems) =>
        (obj = { item: obj.item, amount: obj.amount, price: obj.price })
    );
    const order = { date, items: newItems, total };
    confirmOrder(currentUser.id, order);
    dispatch(
      setCart({
        date: "",
        total: 0,
        items: [{ item: "", image: "", amount: 0, price: 0 }],
      })
    );
    navigate('/user')
  };

  const handleQty = (qty:number, item:string) => {
    const orderDetail: CartOrderWImage = Object.assign({}, cart);

    orderDetail.items = cart.items.map((part) =>
      part.item === item
        ? (part = {
            item: part.item,
            amount: qty,
            price: part.price,
            image: part.image,
          })
        : part
    );

    orderDetail.total = orderDetail.items.reduce(
      (acc:number, val) => (acc += val.amount * val.price), 0
    );
    dispatch(setCart(orderDetail));
  };

  const handleRemove = (item:string) => {
    const orderDetail: CartOrderWImage = Object.assign({}, cart);
    if (orderDetail.items.length >= 2) {
      orderDetail.items = cart.items.filter((part) =>
        part.item !== item
      );
    }
    else if (orderDetail.items[0].item) {
      orderDetail.items = orderDetail.items.map(v=>{ return({item:"",amount:0,price:0,image:""})})
      navigate("/shop");
    }
    orderDetail.total = orderDetail.items.reduce(
      (acc:number, val) => (acc += val.amount * val.price), 0
    );
    dispatch(setCart(orderDetail))
  }

  const handleRedirect = ()=> {
    dispatch(setShopping(true))
    navigate('/login')
  }

  return (
    <div className="container-fluid">
      {JSON.stringify(cart)}
      <div className="cart-header">
        <h3>Shopping Cart</h3>
        <div className="cart-count">
          <p>items in cart: {cart.items[0].item ? cart.items.length : 0}</p>
        </div>
      </div>
      <div className="shopping-cart-container">
        <hr />
        {cart.items[0].item ? cart.items.map((item) => {
          return (
            <div key={`cart${item.item}`}>
              <div  className="cart-item">
                <div className="item-image">
                  <img
                    src={`../../src/assets/${item.image}.jpg`}
                    alt={item.image}
                  />
                </div>
                <div className="item-center">
                  <h2 className="item-name">{item.item}</h2>
                  <div className="item-qty">
                    Quantity:{" "}
                    <input
                      type="number"
                      min="1"
                      defaultValue={item.amount}
                      style={{ width: "3em", border: "none" }}
                      onChange={(e) => handleQty(parseInt(e.target.value), item.item)}
                    />{" "}
                    Subtotal: ${item.price * item.amount}
                  </div>
                  <button
                    className="btn btn-dark"
                    style={{ fontSize: "smaller"}}
                    onClick={()=>handleRemove(item.item)}
                  >
                    Remove from Cart
                  </button>
                </div>
                <div className="item-price">Price: ${item.price}</div>
              </div>
              <hr />
            </div>
          );
        }): null}
        <div className="cart-footer">
        {currentUser.id ? 

          <button
            className="btn btn-dark checkout-button"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Checkout
          </button>
          :
          <button
            className="btn btn-dark checkout-button"
            onClick={handleRedirect}
          >
            Checkout
          </button>
        }
          <div className="footer-total">
            <div>Total: ${cart.total}</div>
          </div>
        </div>
      </div>
      <div className="cart-modal">
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Confirm Purchase
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <h3>Receipt Total:</h3>
                <small>${cart.total}</small>
                <h3>Payment Information</h3>
                <ul>
                  <li>Name on Card</li>
                  <li>Credit Card Number</li>
                  <li>Expires On</li>
                  <li>CVC</li>
                </ul>
                <h3>Shipping Information</h3>
                <select>
                  <option>Normal</option>
                </select>
                <p>
                  Estimated time of arrival: <code>never</code>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={handlePurchase}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
