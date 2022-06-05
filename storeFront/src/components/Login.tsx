import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "urql";
import { RootState } from "../store";
import {
  setUser,
  setPass,
  setCurrentUser,
  setLogin,
} from "../slices/loginSlice";
import { useEffect, useState } from "react";

const CreateAccount = `
  mutation ($username: String, $password: String) {
    createUser(user: {username: $username, password: $password})
    {
      username
      password
    }
}
`;

const CheckLogin = `
  query ($username: String, $password: String) {
    checkLogin(username: $username, password: $password)
    {
      id
      username
      password
    }
  }
`;

export default function Login() {
  const dispatch = useDispatch();
  const userField = useSelector((state: RootState) => state.login.username);
  const passField = useSelector((state: RootState) => state.login.password);
  const currentUser = useSelector(
    (state: RootState) => state.login.currentUser
  );
  const login = useSelector((state: RootState) => state.login.login);
  const [confirmCreate, setConfirmCreate] = useState(null);
  const [createUserResult, createAccount] = useMutation(CreateAccount);
  const [result, refreshQuery] = useQuery({
    query: CheckLogin,
    variables: { username: userField, password: passField },
    pause: true,
  });
  const { data, fetching, error } = result;

  useEffect(() => {
    if (data) {
      if (data.checkLogin) {
        if (data.checkLogin[0]) {
          dispatch(setCurrentUser(data.checkLogin[0]));
        }
      }
    }
  }, [data]);

  let createResult;
  useEffect(() => {
    if (createUserResult.data) {
      if (createUserResult.data.createUser) {
        if (createUserResult.data.createUser.username) {
          setConfirmCreate(createUserResult.data.createUser.username);
        }
      }
    }
  }, [createUserResult.data]);

  // if (fetching) return <p>Loading...</p>;
  // if (error) return <p>Something has gone wrong: {error.message}</p>;

  const createUser = (username: string, password: string) => {
    const variables = { username, password };
    createAccount(variables).then((result) =>
      result.error ? console.error(result.error) : null
    );
  };

  const handleChangeUser = (e: any) => {
    if (confirmCreate) {
      setConfirmCreate(null);
    }
    dispatch(setUser(e.target.value));
  };
  const handleChangePass = (e: any) => {
    if (confirmCreate) {
      setConfirmCreate(null);
    }
    dispatch(setPass(e.target.value));
  };

  const handleSubmit = () => {
    if (login === "EXISTING") {
      refreshQuery();
    } else if (login === "CREATE") {
      createUser(userField, passField);
    }
  };

  const handleSwitch = () => {
    if (login === "EXISTING") {
      dispatch(setLogin("CREATE"));
    } else if (login === "CREATE") {
      dispatch(setLogin("EXISTING"));
    }
  };

  return (
    <div className="position-relative w-25 mx-auto mt-5">
      {!confirmCreate
        ? null
        : confirmCreate !== "FAILED"
        ? `${confirmCreate} has been successfully created!`
        : "User already exists"}
      <br />
      {currentUser.username}
      <br />
      {/* {JSON.stringify(createUserResult)} */}
      <div className="card">
        <h5 className="card-header">
          {login === "EXISTING" ? "Login to an Account" : "Create an Account"}
        </h5>
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
              onChange={(e) => handleChangeUser(e)}
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
              onChange={(e) => handleChangePass(e)}
            ></input>
          </div>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {login === "EXISTING" ? "Login" : "Create Account"}
          </button>
        </div>
      </div>
      <button onClick={handleSwitch}>
        {login === "EXISTING"
          ? "Create a New Account"
          : "Login with an Existing Account"}
      </button>
    </div>
  );
}
