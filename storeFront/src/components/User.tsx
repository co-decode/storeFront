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
    if (changePass && changePass === changePass2){
        passwordChange(currentUser.id, changePass)
    }
  }

  return (
    <div className="position-relative">
      You are logged in as {currentUser.username}
      <br />
      <button className="btn btn-dark" onClick={() => setShowPass(!showPass)}>
        {showPass ? currentUser.password : "View your password"}
      </button>
      <button
        className="btn btn-dark"
        onClick={() => setShowChangeForm(!showChangeForm)}
      >
        Change Your Password
      </button>
      {showChangeForm ? (
        <form onSubmit={(e)=>handleSubmit(e)}>
          <label htmlFor="changePass">New Password: </label>
          <input id="changePass" type="text" onChange={(e)=>setChangePass(e.target.value)}/>
          <label htmlFor="changePass2">Confirm Password: </label>
          <input id="changePass2" type="text" onChange={(e)=>setChangePass2(e.target.value)}/>
          <button type="submit">Submit</button>
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
