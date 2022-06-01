// import { useState } from 'react'
import { useMutation, useQuery } from "urql";
import { Counter } from "./features/counter/Counter";
import { Logger } from "./features/login/Login";
import { RootState } from "./store";
import { useSelector, useDispatch } from "react-redux";
import { setItem, setPrice } from "./features/itemSlice";
import "./App.css";

import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

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
    <div id="app-wrap" className="container-fluid">
      <img id="bg" src="../bgLQ.jpg" />
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
