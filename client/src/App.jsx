import React, { useState } from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

import "./index.css";
import Chat from './Components/Chat';
import LandingPage from './Components/LandingPage';

const App = () => {
    const [user, setUser] = useState(null);
    const [roomId, setRoomId] = useState(-Infinity);
    return (
        <>
        {(!user || roomId===-Infinity) ? <LandingPage setUser={setUser} setRoomId={setRoomId}/> : <Chat user={user} roomId={roomId}/>}
        </>
    )
}


ReactDOM.render(<App />, document.getElementById("app"));
