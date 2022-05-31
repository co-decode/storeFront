// import { useState } from 'react'
import { useMutation, useQuery } from "urql";
import { Counter } from "./features/counter/Counter";
import { Logger } from "./features/login/Login";
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

function App() {
  const [result, refreshQuery] = useQuery({
    query: getItemsQuery,
  });
  const { data, fetching, error } = result;

    const [postItemResult, postItem] = useMutation(PostItem);

    const submit = (item: string, price: number) => {
      const variables = { item, price };
      postItem(variables).then((result) => {
        console.log(JSON.stringify(result.data));
        if (result.error) {
          console.error("Something has gone wrong", result.error);
        }
      });
    };

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Aw, hell no: {error.message}</p>;

  return (
    <div>
      Hello World! {JSON.stringify(data.getAllItems)}
      <button onClick={()=>submit("item3000", 500)}>Post item 3000?</button>
      <Counter />
      <Logger />
    </div>
  );
}

export default App;
