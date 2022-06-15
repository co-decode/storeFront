import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { useQuery, useMutation } from "urql";
import { setCart, setPurchase, setShopping } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

  const [mobile, setMobile] = useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sendResult, sendOrder] = useMutation(SendOrder);

  useEffect(() => {
    function watchWidth() {
      if (window.innerWidth <= 576) {
        setMobile(true)
      } else if (window.innerWidth > 576) {
        setMobile(false)
      }
    }
    watchWidth();
    window.addEventListener("resize", watchWidth);
    return () => {
      window.removeEventListener("resize", watchWidth);
    };
  }, []);

  useEffect(() => {
    if (!cart.items[0].item) {
      navigate("/shop");
    }
  }, [cart.items[0].item]);

  const confirmOrder = (id: string, orders: CartOrder) => {
    const variables = { id, orders };
    sendOrder(variables).then((result) => 
      result.error ? console.error(result.error) : null
    );
  };

  const handlePurchase = () => {
    const { total } = cart;
    const newItems = cart.items.map(
      (obj: FinalisedItems) =>
        (obj = { item: obj.item, amount: obj.amount, price: obj.price })
    );
    const timestamp = new Date(Date.now()).toJSON()

    const order = { date: timestamp, items: newItems, total };
    confirmOrder(currentUser.id, order);
    dispatch(
      setCart({
        date: "",
        total: 0,
        items: [{ item: "", image: "", amount: 0, price: 0 }],
      })
    );
    dispatch(setPurchase(true))
    navigate("/user");
  };

  const handleQty = (qty: number, item: string) => {
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
      (acc: number, val) => (acc += val.amount * val.price),
      0
    );
    dispatch(setCart(orderDetail));
  };

  const handleRemove = (item: string) => {
    const orderDetail: CartOrderWImage = Object.assign({}, cart);
    if (orderDetail.items.length >= 2) {
      orderDetail.items = cart.items.filter((part) => part.item !== item);
    } else if (orderDetail.items[0].item) {
      orderDetail.items = orderDetail.items.map((v) => {
        return { item: "", amount: 0, price: 0, image: "" };
      });
      navigate("/shop");
    }
    orderDetail.total = orderDetail.items.reduce(
      (acc: number, val) => (acc += val.amount * val.price),
      0
    );
    dispatch(setCart(orderDetail));
  };

  const handleRedirect = () => {
    dispatch(setShopping(true));
    navigate("/login");
  };

  const backToShop = () => {
    navigate("/shop")
  }

  return (
    <div className="container-fluid mt-1">
      <div className="cart-header">
        <h3 className="cartTitle">Shopping Cart</h3>
        <div className="cart-count">
          <p className="itemsInCart">
            {mobile ? 'Items: ':`Items in cart:` }{cart.items[0].item ? cart.items.length : 0}(
            {cart.items[0].item
              ? cart.items.reduce((acc, val) => (acc += val.amount), 0)
              : 0}
            )
          </p>
        </div>
      </div>
      <div className="shopping-cart-container mb-1">
        <hr />
        {cart.items[0].item
          ? cart.items.map((item) => {
              return (
                <div key={`cart${item.item}`}>
                  <div className="cart-item">
                    <div className="item-image">
                      <img
                        src={`../../src/assets/${item.image}.jpg`}
                        alt={item.image}
                      />
                    </div>
                    <div className="item-center">
                      <h2 className="item-name">{item.item}</h2>
                      <div className="item-qty">
                        {mobile ? 'Qty:' : `Quantity:`}{" "}
                        <input
                          type="number"
                          min="1"
                          defaultValue={item.amount}
                          style={{ width: "3em", border: "none" }}
                          onChange={(e) =>
                            handleQty(parseInt(e.target.value), item.item)
                          }
                        />{" "}
                        <span className="keepTogether">{mobile ? 'Total: $':`Subtotal: $`}{item.price * item.amount}</span>
                      </div>
                      <button
                        className="btn btn-dark cartRemove"
                        onClick={() => handleRemove(item.item)}
                      >
                        {mobile ? "Remove" : "Remove from Cart"}
                      </button>
                    </div>
                    <div className="item-price">{mobile ? `$${item.price}`:`Price: $${item.price}`}</div>
                  </div>
                  <hr />
                </div>
              );
            })
          : null}
        
      </div>
      <div className="cart-footer">
            <button className="btn btn-dark" style={{width:"max-content"}} onClick={backToShop}>
              Back to Shop
            </button>
          {currentUser.id ? (
            <button
              className="btn btn-dark checkout-button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Checkout
            </button>
          ) : (
            <button
              className="btn btn-dark checkout-button"
              onClick={handleRedirect}
            >
              Checkout
            </button>
          )}
          <div className="footer-total">
            <div>{mobile ? `$`:`Total: $`}{cart.total}</div>
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
          <div className="modal-dialog purchaseModalDialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title purchaseModalTitle" id="exampleModalLabel">
                  Confirm Purchase
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body confirmModal">
                <h4 className="mb-3">Receipt Total:</h4>
                <strong className="ms-3">${cart.total} AUD</strong>
                <h4 className="mt-2">Payment Information</h4>
                <form className="creditInfo mb-2">
                  <label htmlFor="credit1">Name on Card</label>
                  <input
                    id="credit1"
                    style={{ gridRow: "2/3", gridColumn: "1 / 3" }}
                    type="text"
                    disabled
                  />
                  <label htmlFor="credit2" style={{ gridRow: "3/4", gridColumn:"1 / 3"}}>
                    Credit Card Number
                  </label>
                  <input
                    id="credit2"
                    style={{ gridRow: "4/5", gridColumn: "1 / 3" }}
                    type="text"
                    disabled
                  />
                  <label htmlFor="credit3" style={{ gridRow: "5/6" }}>
                    Expires On
                  </label>
                  <input
                    id="credit3"
                    style={{ gridRow: "6/7", gridColumn: "1 / 2" }}
                    type="text"
                    disabled
                  />
                  <input
                    id="credit3.1"
                    style={{ gridRow: "6/7", gridColumn: "2 / 3" }}
                    type="text"
                    disabled
                  />
                  <label htmlFor="credit4" style={{ gridRow: "7/8" }}>
                    CVC
                  </label>
                  <input id="credit4" type="text" style={{ gridRow: "8/9" }} disabled />
                </form>
                <h4>Shipping Information <small><sup>Free Shipping!</sup></small></h4>
                <div className="purchaseModalSelectDiv" style={{ display: "flex", alignItems: "center"}}>
                  <select className="btn btn-dark m-2 purchaseModalSelect">
                    <option>Normal</option>
                    <option>Express</option>
                  </select>
                  <div className="ms-3 purchaseModalEstimate">
                    Estimated time of arrival:{" "}
                    <samp className="ms-1">
                      <strong>never</strong>
                    </samp>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary purchaseModalButtons"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary purchaseModalButtons"
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
