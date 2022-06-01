export default function Shop() {
  return (
    <div className="position-relative">
      This is the shop
      <div className="col-3 card">
        <img src="../../duck.jpg" height="150" className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title">Duck</h5>
          <p className="card-text">
            This is a <em>lovely</em> duck...
          </p>
          <a href="#" className="btn btn-primary">
            Get Duck
          </a>
        </div>
      </div>
    </div>
  );
}
