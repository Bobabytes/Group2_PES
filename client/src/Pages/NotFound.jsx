import { useState, useEffect } from 'react'
import axios from "axios";
import '../index.css';

function Login() {
    // Data pulled from backend is saved here
    const [count, setCount] = useState(0);
    const [array, setArray] = useState([]);

    // Base Axios usage
    const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    setArray(response.data.fruits);
    console.log(response.data.fruits);
    }
    // API Fetch
    useEffect( () => {
    fetchAPI();
    }, []);




    return (
        <div>
        <h1>404 Not Found Page</h1>
        <hr></hr>
        <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
            CLICK HERE! Count is {count}
            </button>
            <p>
            Lots to do.
            </p>

            {/** Use data pulled from backend to display strings */}
            {
            array.map((fruit, index) => (
                <div key={index}>
                <p>{fruit}</p>
                <br></br>
                </div>
            ))
            }
        </div>
        <p className="read-the-docs">
            If you can see fruits, that means the backend is working
        </p>
        </div>
    )
}

export default Login;