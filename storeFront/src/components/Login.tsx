import { Outlet } from "react-router-dom";
export default function Login() {
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
        //   onChange={}
        ></input>
      </div>
      <a href="#" className="btn btn-primary">Go somewhere</a>

      </div>
      </div>
      
    </div>
  );
}
