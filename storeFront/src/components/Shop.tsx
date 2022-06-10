import { useQuery } from "urql";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../slices/pageSlice";
import { setCart } from "../slices/cartSlice";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";

const getItemsQuery = `
query ($offset: Int, $limit: Int) {
  getItemsPaged(offset: $offset, limit:$limit) {
    # id
    item
    price
    image
  }
}
`;

declare var bootstrap: any;

interface variablesQ {
  offset: number;
  limit: number;
}

interface OrderItems {
  item: string;
  amount: number;
  price: number;
  image: string;
}

interface CartOrder {
  date: string;
  items: OrderItems[];
  total: number;
}

export default function Shop({ offset, limit }: variablesQ) {
  const [result, refreshQuery] = useQuery({
    query: getItemsQuery,
    variables: { offset, limit },
  });
  const page = useSelector((state: RootState) => state.page.page);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, fetching, error } = result;
  if (error) return <p>Something has gone wrong: {error.message}</p>;

  const handleCart = (
    item: string,
    price: number,
    amountID: string,
    image: string
  ) => {
    const amount: number = parseInt(
      (document.getElementById(amountID) as HTMLInputElement)?.value
    );
    const orderDetail: CartOrder = Object.assign({}, cart);

    const newItem: OrderItems = { item, amount, price, image };
    !cart.items[0].item
      ? (orderDetail.items = [newItem])
      : cart.items.some(part=>part.item === newItem.item) 
      ? orderDetail.items = cart.items.
        map(part=> part.item === newItem.item 
          ? part = {item: part.item, amount: part.amount + newItem.amount, price, image}
          : part)
      : orderDetail.items = [...cart.items, newItem];

    orderDetail.total = cart.total + amount * price;
    dispatch(setCart(orderDetail));
  };

  const handleCartClick = (val:OrderItems) => {
    if (!fetching){
      handleCart(
        val.item,
        val.price,
        `amount${val.item}`,
        val.image
      );
      const toastLive = document.getElementById('liveToast')
      new bootstrap.Toast(toastLive).show()
  }}

  const handleGo = () => {
    navigate("/cart")
  }

  return (
    <div>
      {/* This is the shop {JSON.stringify(cart)} */}
      <div className="row gap-5 justify-content-center mt-2" style={{width:"100vw"}}>
        {(fetching ? [{item:"loading...", image:"blank", price:0}] : data.getItemsPaged).map((val: any) => {
          return (
            <div
              key={val.item}
              className="card"
              style={{ width: "18rem", padding: 0 }}
            >
              <div className="wrapper">
                <img
                  src={`../../src/assets/${val.image}.jpg`}
                  className="card-img-top wrapper-img"
                  alt={val.image}
                />
              </div>
              <div className="card-body shopCard">
                <div className="cardX">
                  <div className="card-text cardName">{val.item}</div>
                  <div className="cardXPrice">
                    <div className="cardPrice">${val.price}</div>
                    <div>
                      <label htmlFor={`amount${val.item}`}>x</label>
                      <input
                        id={`amount${val.item}`}
                        className="cardXinput"
                        type="number"
                        defaultValue="1"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="cardCart"
                  onClick={()=>handleCartClick(val)}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      <nav aria-label="Item Pages" className="shopNav">
        <ul className="pagination pagination-lg justify-content-center mt-4">
          {[0, 1, 2, 3, 4, 5].map((val) => {
            return (
              <li
                key={val}
                className={`page-item ${page === val ? "active" : ""}`}
                aria-current="page"
              >
                <span
                  className="page-link"
                  onClick={() => dispatch(setPage(val))}
                >
                  {val + 1}
                </span>
              </li>
            );
          })}
        </ul>
      {cart.items[0].item
      ?<button className="btn btn-dark" onClick={handleGo}>Go to Cart</button>
      :null}
      </nav>
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div
          id="liveToast"
          className="toast bg-dark border-0 text-white zambini"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-body">
            Item added to Shopping Cart
          </div>
          <button
              type="button"
              className="btn-close bg-light me-3"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
        </div>
      </div>
    </div>
  );
}
