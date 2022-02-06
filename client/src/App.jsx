import React, { useState } from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

import "./index.css";
import Chat from './Components/Chat';
import LandingPage from './Components/LandingPage';

const App = () => {
    const [user, setUser] = useState(null);
    const [roomId, setRoomId] = useState(0);
    return (
        <>
        {(!user && !roomId) ? <LandingPage /> : <Chat />}
        </>
    )
}


ReactDOM.render(<App />, document.getElementById("app"));
