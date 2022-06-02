export default function Shop() {
  return (
    <div className="position-relative">
      This is the shop
      <div className="row gap-5 justify-content-center">
        <div className="card" style={{ width: "18rem", padding:0 }}>
          <img src="../../20kg.jpg" className="card-img-top borderless" style={{borderColor: "none"}} alt="..." />
          <div className="card-body">
            <p className="card-text">
              Item One <br/>
              <small>$15.00</small>
            </p>
          </div>
        </div>

        <div className="card" style={{ width: "18rem", padding:0 }}>
          <img src="../../SkippingRope.jpg" className="card-img-top" alt="..." />
          <div className="card-body">
            <p className="card-text">
              
            </p>
          </div>
        </div>

        <div className="card" style={{ width: "18rem", padding:0 }}>
          <img src="../../Gripper.jpg" className="card-img-top" alt="..." />
          <div className="card-body">
            <p className="card-text">
              
            </p>
          </div>
        </div>
      </div>

      <nav aria-label="...">
        <ul className="pagination pagination-lg justify-content-center mt-4">
          <li className="page-item active" aria-current="page">
            <span className="page-link">1</span>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              2
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              3
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              4
            </a>
          </li>
        </ul>
      </nav>

    </div>
  );
}
