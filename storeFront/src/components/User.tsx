import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { useQuery, useMutation} from "urql";
import React, { useEffect, useState } from "react";
import { setCurrentUser } from "../slices/loginSlice";


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
  const [showPass, setShowPass] = useState(false);
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [changePass, setChangePass] = useState("");
  const [changePass2, setChangePass2] = useState("");
  const [showFeedback, setShowFeedback] = useState("none")
  
  const dispatch = useDispatch();

  const [changeResult, changePassMut] = useMutation(ChangePassMut);

  const navigate = useNavigate();

  if (!currentUser.id) {
    navigate("/");
  }

  useEffect(()=>{
    console.log(JSON.stringify(changeResult))
    if(changeResult.data) {
        dispatch(setCurrentUser({id: currentUser.id, username: currentUser.username, password: changeResult.data.updatePass.password})) 
    }
  },[changeResult])

  useEffect(()=> {
    const forms = document.querySelectorAll(".changeForm")
    switch(showFeedback) {
      case "none":
        forms.forEach(form=>form.classList.remove("is-valid","is-invalid"))
        break
      case "success":
        forms.forEach(form=>form.classList.add("is-valid"))
        break
      case "fail":
        forms.forEach(form=>form.classList.add("is-invalid"));
        break
      default:
        break
    }
  },[showFeedback])

  const id = currentUser.id;
  const [historyResult, refreshQuery] = useQuery({
    query: queryOrders,
    variables: { id: id },
  });
  if (historyResult.fetching) return <div>loading...</div>;

  const passwordChange = (id: string, password: string) => {
      const variables = {id, password};
      changePassMut(variables).then(result=>{
          result.error? console.error(result.error) : null
      })
  }

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (changePass && changePass === changePass2 && changePass!==currentUser.password){
      passwordChange(currentUser.id, changePass)
      setShowFeedback("success")
    }
    else if (!changePass || !changePass2 || changePass !== changePass2 || changePass===currentUser.password) {
      setShowFeedback("fail")
    }
  }

  const resetFeedback = () => {
    setShowFeedback("none")
  }

  const toggleForm = () => {
    setShowChangeForm(!showChangeForm)
    setChangePass("")
    setChangePass2("")
    setShowFeedback("none")
  }

  return (
    <div className="position-relative">
      You are logged in as {currentUser.username}
      <br />
      {showFeedback}
      <button className="btn btn-dark" onClick={() => setShowPass(!showPass)}>
        {showPass ? currentUser.password : "View your password"}
      </button>
      <button
        className="btn btn-dark"
        onClick={toggleForm}
      >
        Change Your Password
      </button>
      {showChangeForm ? (
        <form className="needs-validation" onSubmit={(e)=>handleSubmit(e)}>
          <label htmlFor="changePass">New Password: </label>
          <input id="changePass" className="form-control changeForm" type="text" onChange={(e)=>setChangePass(e.target.value)} onFocus={resetFeedback}/>
          <label htmlFor="changePass2">Confirm Password: </label>
          <input id="changePass2" className="form-control changeForm" type="text" onChange={(e)=>setChangePass2(e.target.value)} onFocus={resetFeedback}/>
          <button type="submit">Submit</button>
          <div className="valid-feedback">
            {showFeedback === "success" ? "Your password has been changed!"
            : null}
          </div>
          <div className="invalid-feedback">
            {showFeedback === "fail" && (!changePass || !changePass2) ? "You cannot submit an empty entry"
            :showFeedback === "fail" && changePass!==changePass2 ? "Passwords are not equal"
            :showFeedback === "fail" && changePass === currentUser.password ? "This is already your password"
            :null}
          </div>
        </form>
      ) : null}
      <h4>Check out your previous purchases:</h4>
      <div>
        {historyResult.data.getUser.orders.map((val: Order, index: number) => {
          return (
            <div key={val.id}>
              <p>Order {index + 1}</p>
              <div>Order ID: {val.id}</div>
              <div>Date: {val.date}</div>
              <ul>
                Items:
                {val.items.map((v: Detail) => {
                  return (
                    <li key={v.item}>
                      {v.item}, Amount: {v.amount}, Price: {v.price}
                    </li>
                  );
                })}
              </ul>
              <div>Total: {val.total}</div>
              <hr />
            </div>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
}
