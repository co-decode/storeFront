import { useQuery } from "urql";
import { useDispatch, useSelector } from "react-redux";
import { setPage, setLimit } from "../slices/pageSlice";
import { setCart } from "../slices/cartSlice";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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

  useEffect(() => {
    function watchWidth() {
      if (window.innerWidth <= 576) {
        document
          .querySelector(".pagination")
          ?.classList.remove("pagination-lg", "mt-4");
        document.querySelector(".navButt")?.classList.remove("mb-1");
      } else if (window.innerWidth > 576) {
        if (
          !document
            .querySelector(".pagination")
            ?.classList.contains("pagination-lg")
        ) {
          document
            .querySelector(".pagination")
            ?.classList.add("pagination-lg", "mt-4");
          document.querySelector(".navButt")?.classList.add("mb-1");
        }
      }
    }
    watchWidth();
    window.addEventListener("resize", watchWidth);
    return () => {
      window.removeEventListener("resize", watchWidth);
    };
  }, []);

  useEffect(() => {
    function initialiseArray() {
      if (window.innerWidth <= 623) {
        dispatch(setLimit(3));
      } else if (window.innerWidth > 623 && window.innerWidth <= 959) {
        dispatch(setLimit(4));
      } else if (window.innerWidth > 959 && window.innerWidth <= 1295) {
        dispatch(setLimit(6));
      } else if (window.innerWidth > 1295 && window.innerWidth <= 1631) {
        dispatch(setLimit(8));
      } else if (window.innerWidth > 1295 && window.innerWidth <= 1659) {
        dispatch(setLimit(10));
      } else if (window.innerWidth > 1659 && window.innerWidth <= 2191) {
        dispatch(setLimit(6));
      } else if (window.innerWidth > 2191) {
        dispatch(setLimit(8));
      }
    }
    initialiseArray();
    window.addEventListener("resize", initialiseArray);
    return () => {
      window.removeEventListener("resize", initialiseArray);
    };
  }, []);

  useEffect(() => {
    if (page > Math.ceil(16 / limit)) {
      dispatch(setPage(0));
    }
  }, [limit]);

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
      : cart.items.some((part) => part.item === newItem.item)
      ? (orderDetail.items = cart.items.map((part) =>
          part.item === newItem.item
            ? (part = {
                item: part.item,
                amount: part.amount + newItem.amount,
                price,
                image,
              })
            : part
        ))
      : (orderDetail.items = [...cart.items, newItem]);

    orderDetail.total = cart.total + amount * price;
    dispatch(setCart(orderDetail));
  };

  const handleCartClick = (val: OrderItems) => {
    if (!fetching) {
      handleCart(val.item, val.price, `amount${val.item}`, val.image);
      const toastLive = document.getElementById("liveToast");
      new bootstrap.Toast(toastLive).show();
    }
  };

  const handleGo = () => {
    navigate("/cart");
  };

  if (error) return <p>Something has gone wrong: {error.message}</p>;

  return (
    <div>
      <div
        className="row gap-5 justify-content-center mt-2 item-displayer"
        style={{ width: "100%", marginLeft: 0, marginRight: 0 }}
      >
        {(fetching
          ? [{ item: "loading...", image: "blank", price: 0 }]
          : data.getItemsPaged
        ).map((val: any) => {
          return (
            <div
              key={val.item}
              className="card shopCardParent"
              style={{ padding: 0 }}
            >
              <div className="wrapper">
                {fetching ? (
                  <div className="spinner-border imageSpinner" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <img
                    src={`/${val.image}.jpg`}
                    className="card-img-top wrapper-img"
                    alt={val.image}
                  />
                )}
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
                  onClick={() => handleCartClick(val)}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      <nav aria-label="Item Pages" className="shopNav">
        <ul className="pagination pagination-lg justify-content-center mt-4">
          {new Array(Math.ceil(16 / limit))
            .fill(1)
            .map((val, index) => index)
            .map((val) => {
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
        {cart.items[0].item ? (
          <button className="btn btn-dark mb-1 navButt" onClick={handleGo}>
            Go to Cart
          </button>
        ) : null}
      </nav>
      <div
        className="position-fixed bottom-0 end-0 m-3 "
        style={{ zIndex: 11 }}
      >
        <div
          id="liveToast"
          className="toast bg-dark border-0 text-white shopToast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-body shopToastBody">
            Item added to Shopping Cart
          </div>
          <button
            type="button"
            className="btn-close bg-light me-3 shopToastButton"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
}
