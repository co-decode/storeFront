import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const handleShop = () => {
    navigate("/shop")
  }
  return (
    <>
      <div id="bgContainer"></div>

      <div className="container position-relative welcomeC">
        <h1 className="display-1 welcome">Welcome,</h1>
        <h1 className="display-3 offset-md-1 mobileInvis welcome2">to my fitness store</h1>
        <button
          className="btn btn-dark offset-2 mt-3 welcomeB"
          tabIndex={1}
          style={{ borderRadius: "50px" }}
          onClick={handleShop}
        >
          Start Shopping
        </button>
      </div>
    </>
  );
}
