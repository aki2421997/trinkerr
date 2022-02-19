import { useEffect, useRef, useState } from "react";

const BASE_URL = "http://3.109.141.224:5000";

function debounce(cb,delay=300) {
    let timer = null;
    return function (...params) {
        timer && clearTimeout(timer);
        timer = setTimeout(()=>{
            cb.apply(null,params);
        },delay);
    }
}

export default function App() {
  const userToken = useRef(null);
  const [data, setData] = useState(null);
  useEffect(()=>{
    (async function () {
      try {
        const res = await fetch(`${BASE_URL}/api/user-access-token`);
        const {token} = await res.json();
        userToken.current = token;
      } catch (error) {
        console.log(error);
      }
    })();
  },[]);

  const handleSearch = async (evt) => {
    const val = evt.target.value;
    console.log(val);
    try {
        const res = await fetch(`${BASE_URL}/api/data?search_string=${val}`,{
            headers: {
                'user-access-token': userToken.current
            }
        });
        setData(await res.json());
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <input type="text" onChange={debounce(handleSearch,500)}/>
      <div className="list">
          {data?.map(item => {
              return(
                <div className="subList" key={item[0]}>
                    {item.toString()}
                </div>
              )
          })}
      </div>
    </div>
  );
}
