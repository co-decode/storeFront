import { useQuery } from "urql";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../slices/pageSlice";
import { setCart } from "../slices/cartSlice";
import { RootState } from "../store";

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
  const cart = useSelector((state: RootState) => state.cart);

  const dispatch = useDispatch();
  const { data, fetching, error } = result;
  if (fetching) return <p>Loading...</p>;
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
    const orderDetail: CartOrder = Object.assign({}, cart.cart);

    orderDetail.date
      ? orderDetail.date
      : (orderDetail.date = new Date(Date.now()).toUTCString());

    const newItem: OrderItems = { item, price, amount, image };
    cart.cart.items[0].item
      ? (orderDetail.items = [...cart.cart.items, newItem])
      : (orderDetail.items = [newItem]);

    orderDetail.total = cart.cart.total + amount * price;
    console.log(JSON.stringify(orderDetail));
    dispatch(setCart(orderDetail));
  };

  /* 
  const toastTrigger = document.getElementById('liveToastBtn')
  const toastLiveExample = document.getElementById('liveToast')
  if (toastTrigger) {
    toastTrigger.addEventListener('click', function () {
      var toast = new bootstrap.Toast(toastLiveExample)

    toast.show()
  })
}
 
  */

  const handleCartClick = (val:OrderItems) => {
    handleCart(
      val.item,
      val.price,
      `amount${val.item}`,
      val.image
    );
    const toastLiveExample = document.getElementById('liveToast')
    new bootstrap.Toast(toastLiveExample).show()
  }

  return (
    <div className="position-relative">
      This is the shop {JSON.stringify(cart)}
      <div className="row gap-5 justify-content-center">
        {data.getItemsPaged.map((val: any) => {
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
      <nav aria-label="Item Pages">
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
