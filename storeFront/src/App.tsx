// import { useState } from 'react'
import { useMutation, useQuery } from "urql";
import { Counter } from "./features/counter/Counter";
import { Logger } from "./features/login/Login";
import { RootState } from "./store";
import { useSelector, useDispatch } from "react-redux";
import {setItem, setPrice} from "./features/itemSlice";
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

  const itemName = useSelector((state:RootState) => state.item.item)
  const itemPrice = useSelector((state:RootState) => state.item.price)
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
  if (error) return <p>Aw, hell no: {error.message}</p>;

  
  
  const handleForm = (e: any) => {
    e.preventDefault();
    return;
  }

  

  return (
    <div>
      Hello World! {JSON.stringify(data.getAllItems)}
      <button onClick={() => submit("item3000", 500)}>Post item 3000?</button>
      <button onClick={() => submitDelete("6295a22661184de26beeade2")}>
        Delete item 3000?
      </button>
      <button
        onClick={() =>
          submitUpdate("6295b053b2019bc05879c1f3", "itemUPDATED", 18)
        }
      >
        Update item 3000?
      </button>
      <form onSubmit={(e)=>handleForm(e)}>
        <label htmlFor="itemName">Enter an Item Name:</label>
        <input id="itemName" type="text" onChange={(e)=>dispatch(setItem(e.target.value))}/>
        <label htmlFor="itemPrice">Enter an Item Price:</label>
        <input id="itemPrice" type="text" onChange={(e)=>dispatch(setPrice(parseInt(e.target.value)))}/>
        <button onClick={()=>submit(itemName, itemPrice)}>Post a new item</button>
      </form>
      <span>Item Name: {itemName}</span>
      <span>Item Price: {itemPrice}</span>
      <Counter />
      <Logger />
    </div>
  );
}

export default App;
