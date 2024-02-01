import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";

function Info() {
    const [username, setUserName] = useState(null);
    const [name, setName] = useState(null);
    useEffect(() => {
        fetch("http://0.0.0.0:8080/authentication/get_my_info", {
            method: "GET",
            headers: {
                "Authorization": "Bearer Pierre",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setUserName(data.username);
                setName(data.full_name);
                console.log(data);
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <div>
            Username: {username && <p>{username}</p>}
            Full Name: {name && <p>{name}</p>}
        </div>
    );
}


function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <Info/>
            </header>
        </div>
    );
}

export default App;
