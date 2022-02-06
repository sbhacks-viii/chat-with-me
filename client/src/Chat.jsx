import React, { useState } from'react';

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
mutation ($user:String!, $content: String!) {
    postMessage(user: $user, content: $content)
}
`

const Messages = ({ user }) => {
    const { data } = useSubscription(GET_MESSAGES);
    console.log("inside messages", data);
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

const Chat = () => {
    const [state, setState] = useState({
        user: 'Bryan',
        content: '',
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
        });
    }

    return (
        <>
        <br />
        <Container style={{overflowY: 'scroll', height: '500px', width: '80%', justifyContent: "center", background: "#D6FFFC"}}>
            <Messages user={state.user} />
        </Container>
        <br />
        <Container style={{flex:1, width: '80%', justifyContent: "center" }}>
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
                    <Button onClick={() => onSend()}>
                        Send
                    </Button>
                </Col>
            </Row>
        </Container>
        </>
    )
}

export default () => (
    <ApolloProvider client={client}>
        <Chat/>
    </ApolloProvider>
)