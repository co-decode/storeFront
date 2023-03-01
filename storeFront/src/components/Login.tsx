import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "urql";
import { RootState } from "../store";
import {
  setUser,
  setPass,
  setCurrentUser,
  setLogin,
} from "../slices/loginSlice";
import { setShopping } from "../slices/cartSlice";
import { useEffect, useRef, useState } from "react";

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
  const navigate = useNavigate();
  const userField = useSelector((state: RootState) => state.login.username);
  const passField = useSelector((state: RootState) => state.login.password);
  const usernameRef = useRef<HTMLInputElement|null>(null);
  const passwordRef = useRef<HTMLInputElement|null>(null);
  const currentUser = useSelector(
    (state: RootState) => state.login.currentUser
  );
  const login = useSelector((state: RootState) => state.login.login);
  const shopping = useSelector((state: RootState) => state.cart.shopping);
  const [confirmCreate, setConfirmCreate] = useState("none");
  const [failedLogin, setFailedLogin] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [viewPass, setViewPass] = useState(false);
  const [createUserResult, createAccount] = useMutation(CreateAccount);
  const [result, refreshQuery] = useQuery({
    query: CheckLogin,
    variables: { username: userField, password: passField },
    pause: true,
  });
  const { data, fetching, error } = result;
  const [existResult, refreshExistence] = useQuery({
    query: CheckExistence,
    variables: { username: userField },
    requestPolicy: "cache-and-network",
    pause: true,
  });

  useEffect(() => {
    refreshExistence();
  }, [userField]);

  useEffect(() => {
    const passfield = document.querySelector("#formControlInput2");
    passfield!.classList.remove("is-valid");
    if (passField && passField === currentUser.password) {
      const passfield = document.querySelector("#formControlInput2");
      passfield!.classList.add("is-valid");
    }
  }, [passField, currentUser]);

  useEffect(() => {
    if (data) {
      if (data.checkLogin) {
        if (data.checkLogin[0]) {
          dispatch(setCurrentUser(data.checkLogin[0]));
          if (shopping) {
            dispatch(setShopping(!shopping));
            navigate("/cart");
          } else {
            setTimeout(() => {
              navigate("/user");
              dispatch(setLogin("EXISTING"));
            }, 300);
          }
        } else setFailedLogin(true);
      }
    }
  }, [data]);

  useEffect(() => {
    if (createUserResult.data) {
      if (createUserResult.data.createUser) {
        if (createUserResult.data.createUser.username === "FAILED") {
          setConfirmCreate("fail");
        } else if (createUserResult.data.createUser.username) {
          setConfirmCreate("success");
        }
      }
    }
  }, [createUserResult.data]);

  useEffect(() => {
    if (existResult.data) {
      if (existResult.data.checkExistence) {
        if (existResult.data.checkExistence[0]) {
          if (existResult.data.checkExistence[0].username) {
            setUserExists(true);
          } else setUserExists(false);
        }
      }
    }
  }, [existResult.data]);

  useEffect(() => {
    if (failedLogin) {
      const passfield = document.querySelector("#formControlInput2");
      passfield!.classList.add("is-invalid");
      if (userExists === false) {
        const userfield = document.querySelector("#formControlInput1");
        userfield!.classList.add("is-invalid");
      }
    } else if (!failedLogin) {
      const passfield = document.querySelector("#formControlInput2");
      passfield!.classList.remove("is-invalid");
      const userfield = document.querySelector("#formControlInput1");
      userfield!.classList.remove("is-invalid");
    }
  }, [failedLogin]);

  useEffect(() => {
    if (userExists) {
      const userfield = document.querySelector("#formControlInput1");
      login === "EXISTING"
        ? userfield!.classList.add("is-valid")
        : userfield!.classList.add("is-invalid");
    }
    if (!userExists) {
      const userfield = document.querySelector("#formControlInput1");
      login === "EXISTING"
        ? userfield!.classList.remove("is-valid")
        : userfield!.classList.remove("is-invalid");
    }
  }, [userExists]);

  useEffect(() => {
    dispatch(setUser(""));
    dispatch(setPass(""));
  }, []);

  useEffect(() => {
    const forms = document.querySelectorAll(".loginInput");
    if (confirmCreate === "fail") {
      forms.forEach((form) => {
        form.classList.add("is-invalid");
      });
    }
    if (confirmCreate === "success") {
      forms.forEach((form) => {
        form.classList.add("is-valid");
      });
    } else if (confirmCreate === "none") {
      forms.forEach((form) => {
        form.classList.remove("is-invalid");
      });
      forms.forEach((form) => {
        form.classList.remove("is-valid");
      });
    }
  }, [confirmCreate]);

  useEffect(() => {
    const forms: NodeListOf<HTMLInputElement> =
      document.querySelectorAll(".loginInput");
    forms.forEach((form) => {
      form.classList.remove("is-invalid", "is-valid");
    });
    forms.forEach((form) => {
      form.value = "";
    });
  }, [login]);

  if (error) return <p>Something has gone wrong: {error.message}</p>;

  const createUser = (username: string, password: string) => {
    const variables = { username, password };
    createAccount(variables).then((result) => {
      if (result.error) console.error(result.error);
      else {
        refreshQuery();
      }
    });
  };

  const handleChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (confirmCreate !== "none") {
      setConfirmCreate("none");
    }
    if (userExists) {
      setUserExists(false);
    }
    setFailedLogin(false);
    dispatch(setUser(e.target.value));
  };
  const handleChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (confirmCreate !== "none") {
      setConfirmCreate("none");
    }
    setFailedLogin(false);
    dispatch(setPass(e.target.value));
  };
  const handleTestUser = () => {
    if (usernameRef.current === null || passwordRef.current === null)
      return
    if (confirmCreate !== "none") {
      setConfirmCreate("none");
    }
    setFailedLogin(false);
    dispatch(setUser("testUser"))
    dispatch(setPass("testUserPassword"))
    usernameRef.current.value = "testUser"
    passwordRef.current.value = "testUserPassword"

  }

  const handleSubmit = () => {
    if (login === "EXISTING") {
      refreshQuery();
    } else if (login === "CREATE") {
      if (userField && passField) {
        createUser(userField, passField);
        // dispatch(setLogin("EXISTING"))
      } else if (!userField || !passField) {
        setConfirmCreate("fail");
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

  const handleViewToggle = () => {
    setViewPass(!viewPass);
    const eye = document.querySelector(".eye");
    !viewPass
      ? eye?.classList.add("eyeclosed")
      : eye?.classList.remove("eyeclosed");
  };

  const enterSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="mx-1 mt-4 loginContainer">
      <div className="subContainer">
        <div className="loginCard card">
          <h5 className="card-header">
            {login === "EXISTING" ? "Existing Account" : "Create an Account"}
          </h5>
          <div className="card-body">
            <div className="mb-33">
              <label htmlFor="formControlInput1" className="form-label">
                Username
              </label>
              {existResult.fetching || fetching || createUserResult.fetching ?
              <div className="spinner-border loginSpinner" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              : null }
              <input
                type="text"
                className="form-control loginInput"
                id="formControlInput1"
                placeholder="username"
                ref={usernameRef}
                onChange={(e) => handleChangeUser(e)}
                onKeyDown={(e) => enterSubmit(e)}
                tabIndex={2}
              />
              <div className="valid-feedback">
                {login === "EXISTING"
                  ? "This username exists"
                  : "Account created!"}
              </div>
              <div className="invalid-feedback">
                {userField && login === "EXISTING"
                  ? "This username does not exist"
                  : userField && login === "CREATE"
                  ? "This username already exists"
                  : "Username cannot be empty"}
              </div>
            </div>
            <div className="mb-33 needs-validation passwordField">
              <label htmlFor="formControlInput2" className="form-label">
                Password
              </label>
              <button
                className="btn eyeopen eye"
                style={{ display: "inline" }}
                onClick={handleViewToggle}
                tabIndex={4}
              ></button>
              <input
                type={viewPass ? "text" : "password"}
                className="form-control loginInput"
                id="formControlInput2"
                placeholder="password"
                ref={passwordRef}
                onChange={(e) => handleChangePass(e)}
                onKeyDown={(e) => enterSubmit(e)}
                tabIndex={3}
              ></input>
              <div className="valid-feedback">
                {login === "EXISTING" ? "This password is correct!" : null}
              </div>
              <div className="invalid-feedback">
                {passField && login === "EXISTING"
                  ? "Password is incorrect"
                  : passField && login === "CREATE"
                  ? null
                  : "Password cannot be empty"}
              </div>
            </div>
            <button
              className="btn btn-dark"
              onClick={handleSubmit}
              tabIndex={5}
            >
              {login === "EXISTING" ? "Login" : "Create Account"}
            </button>
          </div>
        </div>
        <button
          className="btn btn-dark mt-2 loginSwitch"
          onClick={handleSwitch}
          tabIndex={6}
        >
          {login === "EXISTING"
            ? "Create a New Account"
            : "Login with an Existing Account"}
        </button>
        {login === "EXISTING" ? 
          <button
            className="btn btn-warning mt-2 testUser"
            onClick={()=>handleTestUser()}
            tabIndex={7}
          >
            Login with a Test User
            </button>
          : null}
      </div>
    </div>
  );
}
