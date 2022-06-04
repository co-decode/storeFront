import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useMutation } from "urql";
import { RootState } from "../store";
import { setUser, setPass } from "../features/login/loginSlice";

const CreateAccount = `
  mutation ($username: String, $password: String) {
    createUser(user: {username: $username, password: $password})
    {
      username
      password
    }
}
`;

export default function Login() {

  const dispatch = useDispatch();
  const userField = useSelector((state:RootState)=>state.login.username)
  const passField = useSelector((state:RootState)=>state.login.password)
  const [createUserResult, createAccount] = useMutation(CreateAccount)

  const createUser = (username: string, password: string) => {
    const variables = {username, password};
    createAccount(variables).then(result=> result.error ? console.error(result.error): null)
  }
  return (
    <div className="position-relative w-25 mx-auto mt-5">

      <div className="card">
        <h5 className="card-header"><Outlet/></h5>
        <div className="card-body">
        
      <div className="mb-3">
        <label htmlFor="formControlInput1" className="form-label">
          Username
        </label>
        <input
          type="text"
          className="form-control"
          id="formControlInput1"
          placeholder="username"
          onChange={(e)=>dispatch(setUser(e.target.value))}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="formControlInput2" className="form-label">
          Password
        </label>
        <input
          className="form-control"
          id="formControlInput2"
          placeholder="password"
          onChange={(e)=>dispatch(setPass(e.target.value))}
        ></input>
      </div>
      <button className="btn btn-primary" onClick={()=>createUser(userField,passField)}>Create Account</button>

      </div>
      </div>
      
    </div>
  );
}
