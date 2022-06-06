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

const CheckExistence = `
  query ($username:String) {
    checkExistence(username:$username) {
      username
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
  const [failedLogin, setFailedLogin] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [createUserResult, createAccount] = useMutation(CreateAccount);
  const [result, refreshQuery] = useQuery({
    query: CheckLogin,
    variables: { username: userField, password: passField },
    pause: true,
  });
  const { data, fetching, error } = result;
  const [existResult, refreshExistence] = useQuery({
    query: CheckExistence,
    variables: {username: userField},
    pause: true,
  })

  useEffect(()=> {
    if(userField){
    refreshExistence()}
  },[userField])

  useEffect(()=> {
    const passfield = document.querySelector("#formControlInput2")
    passfield!.classList.remove("is-valid")
  },[passField])

  useEffect(() => {
    if (data) {
      if (data.checkLogin) {
        if (data.checkLogin[0]) {
          dispatch(setCurrentUser(data.checkLogin[0]));
        }
        else setFailedLogin(true)
      }
    }
  }, [data]);

  useEffect(() => {
    if (createUserResult.data) {
      if (createUserResult.data.createUser) {
        if (createUserResult.data.createUser.username) {
          setConfirmCreate(createUserResult.data.createUser.username);
        }
      }
    }
  }, [createUserResult.data]);

  useEffect(() => {
    if(existResult.data){
      if(existResult.data.checkExistence){
        if(existResult.data.checkExistence[0]) {
          if(existResult.data.checkExistence[0].username){
            setUserExists(true)
          }
          else setUserExists(false)
        }
      }
    }
  },[existResult.data])

  useEffect(() => {
    if(failedLogin) {
      const passfield = document.querySelector("#formControlInput2")
      passfield!.classList.add("is-invalid")
      if(!userExists) {
        const userfield = document.querySelector("#formControlInput1")
        userfield!.classList.add("is-invalid")
      }
    } 
    else if(!failedLogin){
      const passfield = document.querySelector("#formControlInput2")
      passfield!.classList.remove("is-invalid")
      const userfield = document.querySelector("#formControlInput1")
      userfield!.classList.remove("is-invalid")
    }
  },[failedLogin])
  
  useEffect(() => {
    if(userExists) {
      const userfield = document.querySelector("#formControlInput1")
      userfield!.classList.add("is-valid")
    }
    if(!userExists) {
      const userfield = document.querySelector("#formControlInput1")
      userfield!.classList.remove("is-valid")
    }
  },[userExists])

  useEffect(() => {
    if(currentUser.username && currentUser.username !== "FAILED"){
      const passfield = document.querySelector("#formControlInput2")
      passfield!.classList.add("is-valid")}
  }, [currentUser.username])

  useEffect(() => {
    if(confirmCreate === "FAILED") {
      const forms = document.querySelectorAll(".form-control")
      forms.forEach(form=>{form.classList.add("is-invalid")})
    } 
    else if(confirmCreate !== "FAILED"){
      const forms = document.querySelectorAll(".form-control")
      forms.forEach(form=>{form.classList.remove("is-invalid")})
    }
  },[confirmCreate])

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
    if (userExists) {
      setUserExists(false)
    }
    setFailedLogin(false)
    dispatch(setUser(e.target.value));
  };
  const handleChangePass = (e: any) => {
    if (confirmCreate) {
      setConfirmCreate(null);
    }
    setFailedLogin(false)
    dispatch(setPass(e.target.value));
  };

  const handleSubmit = () => {
    if (login === "EXISTING") {
      refreshQuery();
    } else if (login === "CREATE") {
      if (userField && passField){
        createUser(userField, passField);
      }
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
      {/* {failedLogin.toString()} */}
      {/* {userExists.toString()} */}
      <br />
      {/* {JSON.stringify(data)} */}
      {/* {JSON.stringify(existResult.data)} */}
      <div className="card">
        <h5 className="card-header">
          {login === "EXISTING" ? "Login to an Existing Account" : "Create an Account"}
        </h5>
        <div className="card-body">
          <div className="mb-33">
            <label htmlFor="formControlInput1" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="formControlInput1"
              placeholder="username"
              onChange={(e) => handleChangeUser(e)}
              required
            />
            <div className="valid-feedback">This username exists</div>
            <div className="invalid-feedback">{userField ? "This username does not exist" : "Username cannot be empty"}</div>
          </div>
          <div className="mb-33 needs-validation">
            <label htmlFor="formControlInput2" className="form-label">
              Password
            </label>
            <input
              className="form-control"
              id="formControlInput2"
              placeholder="password"
              onChange={(e) => handleChangePass(e)}
            ></input>
            <div className="valid-feedback">This password is correct!</div>
            <div className="invalid-feedback">{passField ? "Password is incorrect" : "Password cannot be empty"}</div>
          </div>
          <button className="btn btn-dark" onClick={handleSubmit}>
            {login === "EXISTING" ? "Login" : "Create Account"}
          </button>
        </div>
      </div>
      <button className="btn btn-dark mt-2" onClick={handleSwitch}>
        {login === "EXISTING"
          ? "Create a New Account"
          : "Login with an Existing Account"}
      </button>
    </div>
  );
}
