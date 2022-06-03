import { useQuery } from "urql";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../features/pageSlice";
import { RootState } from "../store";

const getItemsQuery = `
query ($offset: Int, $limit: Int) {
  getItemsPaged(offset: $offset, limit:$limit) {
    # id
    item
    price
    image
  }
}
`;

interface variablesQ {
  offset: number;
  limit: number;
}

export default function Shop({ offset, limit }: variablesQ) {
  const [result, refreshQuery] = useQuery({
    query: getItemsQuery,
    variables: { offset, limit },
  });
  const page = useSelector((state: RootState) => state.page.page);

  const dispatch = useDispatch();
  const { data, fetching, error } = result;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Something has gone wrong: {error.message}</p>;

  return (
    <div className="position-relative">
      This is the shop
      <div className="row gap-5 justify-content-center">
        {data.getItemsPaged.map((val: any) => {
          return (
            <div key={val.item} className="card" style={{ width: "18rem", padding: 0 }}>
              <div className="wrapper">
                <img
                  src={`../../src/assets/${val.image}.jpg`}
                  className="card-img-top wrapper-img"
                  alt={val.image}
                />
              </div>
              <div className="card-body">
                <p className="card-text">
                  {val.item} <br />
                  <small>${val.price}</small>
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <nav aria-label="Item Pages">
        <ul className="pagination pagination-lg justify-content-center mt-4">
          {[0,1,2,3,4,5].map(val => { return(
            <li key={val} className={`page-item ${page === val ? 'active': ''}`} aria-current="page">
            <span
              className="page-link" onClick={() => dispatch(setPage(val))}>
              {val+1}
            </span>
          </li>
          )
          })}
        </ul>
      </nav>
    </div>
  );
}