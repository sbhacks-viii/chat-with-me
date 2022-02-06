import React from'react';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});


const GET_MESSAGES = gql`
query {
    messages {
        id
        content
        user
    }
}
`;

const Messages = ({ user }) => {
    const { data } = useQuery(GET_MESSAGES);
    console.log("inside messages", data);
    if (!data) {
        return  "No Messages";
    }
    return JSON.stringify(data);
}

const Chat = () => {
    return (
        <div><Messages user="Bryan" /></div>
    )
}

export default () => (
    <ApolloProvider client={client}>
        <Chat/>
    </ApolloProvider>
)