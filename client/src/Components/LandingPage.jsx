import React, { useState } from 'react';
import { Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core';
import useStyles from './LandingPageStyles';
import { Player } from '@lottiefiles/react-lottie-player';
import { WebSocketLink } from '@apollo/client/link/ws';
import './LandingPage.css';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
    useMutation,
    useSubscription,
} from "@apollo/client";

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


const initialState = { name:'', room_id: -Infinity};

const ADD_USER = gql`
mutation ($name:String!, $room_id:Int!) {
    addUser(name: $name, room_id: $room_id)
}
`;


const LandingPage = ( { user, roomId, setUser, setRoomId } ) => {
    const classes = useStyles();
    const [state, setState] = useState(initialState);
    const [addUser] = useMutation(ADD_USER);

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {      
        console.log("state: ", state);
        console.log("user: ", user);
        console.log("roomId: ", roomId);
        addUser({
            variables: {name: state.name, room_id: parseInt(state.room_id)}
        });
        setUser(state.name);
        setRoomId(parseInt(state.room_id));
        console.log(state);
    }

    return (
        <>
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Typography variant="h2">Join a chat!</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2} style={{ justifyContent: 'center' }}>
                        <Player
                            autoplay
                            loop
                            mode="bounce"
                            speed=".5"
                            src="https://assets3.lottiefiles.com/private_files/lf30_DnzJUX.json"
                            style={{ height: '400px', width: '500px' }}
                            />

                        <TextField name="name" onChange={handleChange} variant="outlined" required fullWidth label="username" autoFocus={true} type="text" style={{margin: '10px'}}/>

                        <TextField name="room_id" onChange={handleChange} variant="outlined" required fullWidth label="room ID to join" autoFocus={false} type="number" style={{margin: '10px'}}/>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>Join room</Button>
                </form>
            </Paper>
        </Container>
        </>
    );
};

export default ({setUser, setRoomId}) => (
    <ApolloProvider client={client}>
        <LandingPage setUser={setUser} setRoomId={setRoomId}/>
    </ApolloProvider>
)
