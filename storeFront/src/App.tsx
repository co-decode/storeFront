// import { useState } from 'react'
import { useMutation, useQuery } from "urql";
import { Counter } from "./features/counter/Counter";
import { Logger } from "./features/login/Login";
import { RootState } from "./store";
import { useSelector, useDispatch } from "react-redux";
import { setItem, setPrice } from "./features/itemSlice";
import "./App.css";

const getItemsQuery = `
  query {
    getAllItems {
      id
      item
      price
    }
  }
`;

const PostItem = `
  mutation ($item: String!, $price: Int!) {
    createItem(inventory_item: {
      item: $item,
      price: $price
    }) {
      id
      item
      price
    }
  }
`;

const DeleteItem = `
mutation ($id: ID!) {
  deleteItem(id: $id)
}
`;

const UpdateItem = `
  mutation ($id: ID!, $item: String!, $price: Int!) {
    updateItem(
      id: $id,
      inventory_item: 
        {
          item: $item,
          price: $price
        }
    )
    {
      id
      item
      price
    }
  }
  `;

function App() {
  const [result, refreshQuery] = useQuery({
    query: getItemsQuery,
  });
  const { data, fetching, error } = result;

  const [postItemResult, postItem] = useMutation(PostItem);
  const [deleteItemResult, deleteItem] = useMutation(DeleteItem);
  const [updateItemResult, updateItem] = useMutation(UpdateItem);

  const itemName = useSelector((state: RootState) => state.item.item);
  const itemPrice = useSelector((state: RootState) => state.item.price);
  const dispatch = useDispatch();

  const submit = (item: string, price: number) => {
    const variables = { item, price };
    postItem(variables).then((result) => {
      console.log(JSON.stringify(result.data));
      if (result.error) {
        console.error("Something has gone wrong", result.error);
      }
    });
  };
  const submitDelete = (id: string) => {
    // const variables = { "id": id};
    deleteItem({ id }).then((result) => {
      console.log(JSON.stringify(result.data));
      if (result.error) {
        console.error("Something has gone wrong", result.error);
      }
    });
  };
  const submitUpdate = (id: string, item: string, price: number) => {
    const variables = { id, item, price };
    updateItem(variables).then((result) => {
      console.log(JSON.stringify(result.data));
      if (result.error) {
        console.error("Something has gone wrong", result.error);
      }
    });
  };

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Something has gone wrong: {error.message}</p>;

  const handleForm = (e: any) => {
    e.preventDefault();
    return;
  };

  return (
    <div id="app-wrap">
      <img src="../pexels2.jpg" />
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            My Fitness Storez
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Store
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Login
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Create Account
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Use Existing Account
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;
