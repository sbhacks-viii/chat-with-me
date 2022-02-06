import React, { useState, useEffect, useRef } from'react';

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
    useMutation,
    useSubscription,
} from "@apollo/client";
import { WebSocketLink } from '@apollo/client/link/ws';
import {
    Container, Row, Col, FormInput, Button
} from "shards-react"



const link = new WebSocketLink({
    uri: `ws://localhost:4000/`,
    options: {
        reconnect: true
    }
});


const client = new ApolloClient({
    link,
    uri: "http://localhost:4000/",
    cache: new InMemoryCache(),
});


const GET_MESSAGES = gql`
subscription {
    messages {
        id
        content
        user
    }
}
`;

const POST_MESSAGE = gql`
mutation ($user:String!, $content: String!, $room_id: Int!) {
    postMessage(user: $user, content: $content, room_id: $room_id)
}
`;

const Messages = ({ user }) => {
    const { data } = useSubscription(GET_MESSAGES);
    if (!data) {
        return  null;
    }
    return (
        <>
            {data.messages.map(({id, user: messageUser, content}) => (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: user === messageUser? 'flex-end' : 'flex-start',
                        paddingBottom: '1em',
                    }}
                >
                    {user !== messageUser && (
                        <div
                            style={{
                                height: 50,
                                width: 50,
                                marginRight: '0.5em',
                                border: '2px solid #e5e6ea',
                                borderRadius: 25,
                                textAlign: 'center',
                                fontSize: '18pt',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: "none",
                            }}
                        >
                            {messageUser.slice(0,2).toUpperCase()}
                        </div>
                    )}
                    <div
                        style={{
                            background: user === messageUser ? '#58bf56' : '#e5e6ea',
                            color: user === messageUser ? 'white' : 'black',
                            padding: '1em',
                            borderRadius: '1em',
                            maxWidth: '60%',
                        }}
                    >
                        {content}
                    </div>
                </div>
            ))} 
        </>
    );
}

const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
};

const Chat = ({user, roomId}) => {
    console.log("user: ", roomId);
    console.log("room number: ",roomId)
    const [state, setState] = useState({
        user: user,
        content: '',
        room_id: roomId,
    })

    const [postMessage] = useMutation(POST_MESSAGE);

    const onSend = () => {
        if (state.content.length > 0) {
            postMessage({
                variables: state,
            });
        }

        setState({
            ...state,
            content: "",
            room_id: roomId,
        });
    }


    return (
        <>
        <Container style={{overflowY: 'auto', height: '70vh', width: '75vw', justifyContent: "center", background: "#D6FFFC", borderRadius: "3vh", padding: "3vh"}}>
            <Messages user={state.user} />
            <AlwaysScrollToBottom />
        </Container>
        <Container style={{flex:1, height: '15vh', width: '75%', justifyContent: "center", padding: "5vh" }}>
            <Row>
                <Col xs={2} style={{ padding: 0 }}>
                    <FormInput 
                        label = "User"
                        value={state.user}
                        onChange={(evt) => setState({
                            // TODO: CHANGE LATER FOR USER BASE
                            ...state, 
                            user: evt.target.value,
                        })}
                    />
                </Col>
                <Col xs={8}>
                    <FormInput 
                        label = "Content"
                        value={state.content}
                        onChange={(evt) => setState({
                            ...state, 
                            content: evt.target.value,
                        })}
                        onKeyUp={(evt) => {
                            if (evt.keyCode === 13) {
                                onSend();
                            }
                        }}
                    />
                </Col>
                <Col xs={2} style={{ padding: 0 }}>
                    <Button style={{ width: '100%' }}onClick={() => onSend()}>
                        Send
                    </Button>
                </Col>
            </Row>
        </Container>
        </>
    )
}

const RoomName = ({roomId}) => {
    return (
        <Container
            style={{
                flex: 1,
                height: "15vh",
                width: "75%",
                justifyContent: "center",
                padding: "5vh",
            }}
        >
            <h1>{`Chat Room ${roomId}!`}</h1>
        </Container>
    );
}

export default ({user, roomId}) => (
    <ApolloProvider client={client}>
        <RoomName roomId={roomId}/>
        <Chat user={user} roomId={roomId}/>
    </ApolloProvider>
)