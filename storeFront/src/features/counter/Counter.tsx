// import React from "react";
import { RootState } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "./counterSlice";

export function Counter() {
    const count = useSelector((state:RootState) => state.counter.value);
    const dispatch = useDispatch();

    return (
        <div>
            <button
                onClick={()=> dispatch(increment())}
            >
                Increment
            </button>
            <span>{count}</span>
            <button
                onClick={()=> dispatch(decrement())}
            >
                Decrement
            </button>
        </div>
    )
}

