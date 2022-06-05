import { Outlet } from "react-router-dom";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { useQuery } from "urql";

const queryOrders = `
    query($id: ID) {
        getUser(id: $id) {
            orders {
                id
                date
                items {
                  item
                  amount
                  price
                }
                total
            }
        }
    }
`;

interface Detail {
    item: string,
    amount: number,
    price: number,
    map: Function,
}

interface Order {
    id: string,
    date: string,
    items: Detail,
    total: number,
}

export default function User() {
    const currentUser = useSelector((state:RootState)=> state.login.currentUser)
    const id = currentUser.id
    const [historyResult, refreshQuery] = useQuery({
        query: queryOrders,
        variables: {id:id},
    })
    if (historyResult.fetching) return(<div>loading...</div>)
    return(
        <div className="position-relative">
            You are logged in as {currentUser.username}
            <br/>
            <code>View your password</code>
            <h4>Check out your previous purchases:</h4>
            <div>
                {historyResult.data.getUser.orders.map((val:Order,index:number)=>{
                    return(
                        <div key={val.id}>
                            <p>Order {index+1}</p>
                            <div>Order ID: {val.id}</div>
                            <div>Date: {val.date}</div>
                            <ul>Items: 
                                {val.items.map((v:Detail)=>{return(
                                <li key={v.item}>{v.item}, Amount: {v.amount}, Price: {v.price}</li>
                                )})}
                            </ul>
                            <div>Total: {val.total}</div>
                            <hr/>
                        </div>
                    )
                })}
            </div>
            <Outlet />
        </div>
    )
}