import React, { useState } from 'react';
import { Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core';
import useStyles from './LandingPageStyles';
import { Player } from '@lottiefiles/react-lottie-player';
import './LandingPage.css';
const initialState = { user: '', roomId: -Infinity};

const LandingPage = ( {setUser, setRoomId} ) => {
    const classes = useStyles();
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        setUser(formData.user);
        setRoomId(formData.roomId);
        console.log(formData);
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

                        <TextField name="user" onChange={handleChange} variant="outlined" required fullWidth label="username" autoFocus={true} type="text" style={{margin: '10px'}}/>

                        <TextField name="roomId" onChange={handleChange} variant="outlined" required fullWidth label="room ID to join" autoFocus={false} type="number" style={{margin: '10px'}}/>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>Join room</Button>
                </form>
            </Paper>
        </Container>
        </>
    );
};

export default LandingPage;
