import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { useQuery, useMutation } from "urql";
import React, { useEffect, useState } from "react";
import { setCurrentUser } from "../slices/loginSlice";
import { setPurchase } from "../slices/cartSlice";

declare var bootstrap: any;

const queryOrders = `
  query($id: ID) {
    getUser(id: $id) {
      orders {
        id
        date
        items {
          item
          amount
          price
        }
        total
      }
    }
  }
`;

const ChangePassMut = `
  mutation($id: ID, $password: String) {
    updatePass(id: $id, password:$password) {
      password
    }
  }`;

const CancelOrder = `
  mutation($userId: ID, $orderId: ID) {
    cancelOrder(id1: $userId, id2: $orderId) {
      orders {
        id
        date
        items {
          item
          amount
          price
        }
      }
    }
  }
`;

interface Detail {
  item: string;
  amount: number;
  price: number;
  map: Function;
}

interface Order {
  id: string;
  date: string;
  items: Detail;
  total: number;
}

export default function User() {
  const currentUser = useSelector(
    (state: RootState) => state.login.currentUser
  );
  const purchase = useSelector((state: RootState) => state.cart.purchase);
  const [showPass, setShowPass] = useState(false);
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [changePass, setChangePass] = useState("");
  const [changePass2, setChangePass2] = useState("");
  const [showFeedback, setShowFeedback] = useState("none");
  const [historyOrPass, setHistoryOrPass] = useState("HISTORY");

  const dispatch = useDispatch();

  const [changeResult, changePassMut] = useMutation(ChangePassMut);
  const [cancelResult, cancelOrder] = useMutation(CancelOrder);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.id) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (changeResult.data) {
      dispatch(
        setCurrentUser({
          id: currentUser.id,
          username: currentUser.username,
          password: changeResult.data.updatePass.password,
        })
      );
    }
  }, [changeResult]);

  useEffect(() => {
    const forms = document.querySelectorAll(".changeForm");
    switch (showFeedback) {
      case "none":
        forms.forEach((form) =>
          form.classList.remove("is-valid", "is-invalid")
        );
        break;
      case "success":
        forms.forEach((form) => form.classList.add("is-valid"));
        break;
      case "fail":
        forms.forEach((form) => form.classList.add("is-invalid"));
        break;
      default:
        break;
    }
  }, [showFeedback]);

  const thankYou = () => {
    const toastPurchase = document.getElementById("purchaseToast");
    new bootstrap.Toast(toastPurchase).show();
    dispatch(setPurchase(false));
  };

  useEffect(() => {
    if (purchase) {
      thankYou();
    }
  }, [purchase]);

  const id = currentUser.id;
  const [historyResult, refreshQuery] = useQuery({
    query: queryOrders,
    variables: { id: id },
  });
  // if (historyResult.fetching) return <div>loading...</div>;

  const passwordChange = (id: string, password: string) => {
    const variables = { id, password };
    changePassMut(variables).then((result) => {
      result.error ? console.error(result.error) : null;
    });
  };

  const orderCancellation = (userId: string, orderId: string) => {
    const variables = { userId, orderId };
    cancelOrder(variables).then((result) => {
      result.error ? console.error(result.error) : null;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      changePass &&
      changePass === changePass2 &&
      changePass !== currentUser.password
    ) {
      passwordChange(currentUser.id, changePass);
      setShowFeedback("success");
    } else if (
      !changePass ||
      !changePass2 ||
      changePass !== changePass2 ||
      changePass === currentUser.password
    ) {
      setShowFeedback("fail");
    }
  };

  const resetFeedback = () => {
    setShowFeedback("none");
  };

  const toggleForm = () => {
    setShowChangeForm(!showChangeForm);
    setChangePass("");
    setChangePass2("");
    setShowFeedback("none");
  };

  const handleCancel = (orderId: string) => {
    const userId = currentUser.id;
    orderCancellation(userId, orderId);
  };

  const handleToggle = () => {
    const el = document.getElementById("historyOrPass");
    if (historyOrPass === "PASSWORD") {
      el?.classList.add("gearsvg");
      el?.classList.remove("booksvg");
      setHistoryOrPass("HISTORY");
    } else {
      el?.classList.add("booksvg");
      el?.classList.remove("gearsvg");
      setHistoryOrPass("PASSWORD");
    }
  };

  return (
    <div
      className="profileDisplay"
      style={{ display: "grid", justifyContent: "center" }}
    >
      <div 
        className="profileTitle respondWidth-sm"
      >
        <h3>Welcome {currentUser.username},</h3>
        <div
          id="historyOrPass"
          className="gearsvg"
          onClick={handleToggle}
          role="img"
          title="Toggle Settings"
        />
        <div
        className="position-fixed p-3 purchaseToastContainer"
        style={{ zIndex: 11 }}
      >
        <div
          id="purchaseToast"
          className="toast bg-success border-0 text-white shopToast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-body">Thank you for your purchase!</div>
          <button
            type="button"
            className="btn-close bg-light me-3"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>  
      </div>

      {historyOrPass === "PASSWORD" ? (
        <>
          <div className="userViewPass">
            <button
              className="btn btn-dark me-3"
              onClick={() => setShowPass(!showPass)}
              style={{ width: "188px" }}
            >
              {showPass ? "Hide Password" : "View Password"}
            </button>
            {showPass ? (
              <input
                type="text"
                style={{
                  border: "none",
                  fontSize: "20px",
                  textAlign: "center",
                }}
                value={currentUser.password}
                disabled
              />
            ) : (
              <input
                type="password"
                style={{
                  border: "none",
                  fontSize: "20px",
                  textAlign: "center",
                }}
                value={currentUser.password}
                disabled
              />
            )}
          </div>
          <button
            className="btn btn-dark mt-5"
            style={{ width: "188px" }}
            onClick={toggleForm}
          >
            Change Your Password
          </button>
        </>
      ) : null}
      {showChangeForm && historyOrPass === "PASSWORD" ? (
        <>
          <form
            className="changePassForm needs-validation respondWidth-sm"
            onSubmit={(e) => handleSubmit(e)}
          >
            <label htmlFor="changePass">New Password: </label>
            <input
              id="changePass"
              className="form-control changeForm"
              type="text"
              onChange={(e) => setChangePass(e.target.value)}
              onFocus={resetFeedback}
            />
            <label htmlFor="changePass2" className="mt-3">
              Confirm Password:{" "}
            </label>
            <input
              id="changePass2"
              className="form-control changeForm"
              type="text"
              onChange={(e) => setChangePass2(e.target.value)}
              onFocus={resetFeedback}
            />
            <button className="btn btn-danger mt-3" type="submit">
              Submit
            </button>
            <div className="valid-feedback">
              {showFeedback === "success"
                ? "Your password has been changed!"
                : null}
            </div>
            <div className="invalid-feedback">
              {showFeedback === "fail" && (!changePass || !changePass2)
                ? "You cannot submit an empty entry"
                : showFeedback === "fail" && changePass !== changePass2
                ? "Passwords are not equal"
                : showFeedback === "fail" && changePass === currentUser.password
                ? "This is already your password"
                : null}
            </div>
          </form>
        </>
      ) : null}

      {historyOrPass === "HISTORY" ? (
        <div className="userHistory respondWidth-sm"
        >
          <h4>Purchase History</h4>
          {!historyResult.fetching && historyResult.data.getUser.orders[0]  ? (
            <div style={{ marginLeft: "0", lineHeight: "2em" }}>
              {Object.assign([], historyResult.data.getUser.orders)
                .reverse()
                .map((val: Order) => {
                  return (
                    <div key={val.id}>
                      <div>Order ID: {val.id}</div>
                      <div>Date: {new Date(val.date).toLocaleString()}</div>
                      {val.items.map((v: Detail) => {
                        return (
                          <div key={v.item} className="listDiv">
                            <div>
                              x{v.amount} {v.item}{" "}
                            </div>
                            <div>Price: {v.price}</div>
                          </div>
                        );
                      })}
                      <div className="statusDiv">
                        <div>Total: ${val.total} AUD</div>
                        <div>
                          Status: <em>not shipped</em>
                        </div>
                      </div>
                      <button
                        className="btn btn-danger"
                        style={{
                          width: "300px",
                          height: "24px",
                          padding: 0,
                          fontSize: "smaller",
                        }}
                        tabIndex={-1}
                        onClick={() => handleCancel(val.id)}
                      >
                        Cancel this Order
                      </button>
                      <hr style={{ width: "300px" }} />
                    </div>
                  );
                })}
            </div>
          ) : !historyResult.fetching && !historyResult.data.getUser.orders[0] ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div className="m-5">--- There's nothing here! ---</div>
              <button
                className="btn btn-dark"
                onClick={() => navigate("/shop")}
              >
                Go to Shop
              </button>
            </div>
          ) : (<div>...Loading...</div>)}
        </div>
      ) : null}

      
      <button onClick={thankYou} ></button>
    </div>
  );
}
