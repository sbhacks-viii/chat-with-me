const { GraphQLServer, PubSub } = require('graphql-yoga');

const messages = [];
var curr_room_messages = [];
const users = [];

const typeDefs = `
    type Message {
        id: ID!
        user: String!
        content: String!
        room_id: Int!
    }
    type User {
        id: ID!
        name: String!
        color: Int!
        room_id: Int!
    }
    type Query {
        messages: [Message!]
        messagesByRoom(room_id: Int!): [Message!]
        users: [User!]
        userByUsernameAndRoom(name: String!, room_id: Int!): User
        userByRoom(room_id: Int!): [User!]
    }
    type Mutation {
        postMessage(user: String!, content: String!, room_id: Int!): ID!
        addUser(name: String!, room_id: Int!): ID!
    }
    type Subscription {
        messages: [Message!]
        messagesByRoom(room_id: Int!): [Message!]
    }
`;

const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);

const resolvers = {
    Query: {
        messages: () => messages,
        messagesByRoom(parent, {room_id}) {
            curr_room_messages = messages.filter((message) => (message.room_id) === room_id);
            return curr_room_messages;
        },
        users: () => users,
        userByUsernameAndRoom(parent, {name, room_id}) {
            return users.filter((user) => (user.name === name && user.room_id == room_id))[0];
        },
        userByRoom(parent, {room_id}) {
            return users.filter((user) => (user.room_id) == room_id);
        },
    },
    Mutation: {
        postMessage: (parent, {user, content, room_id}) => {
            const id = messages.length;
            messages.push({
                id, 
                user,
                content,
                room_id
            });
            subscribers.forEach((fn) => fn());
            return id;
        },
        addUser: (parent, {name, room_id}) => {
            const id = users.length;
            const color = id % 280; // 280 is colors.length
            users.push({
                id, 
                name,
                color,
                room_id
            });
            return id;
        },
        
    },
    Subscription: {
        messages: {
            subscribe: (parent, args, { pubsub }) => {
                const channel = Math.random().toString(36).slice(2,15);
                onMessagesUpdates(() => pubsub.publish(channel, { messages }));
                setTimeout(() => pubsub.publish(channel, { messages }), 0);
                console.log(pubsub.asyncIterator(channel))
                return pubsub.asyncIterator(channel);
            }
        },
        messagesByRoom: {
            subscribe: (parent, args, { pubsub }) => {
                const {room_id} = args;
                const curr_room = messages.filter((message) => (message.room_id) === room_id);
                const channel = Math.random().toString(36).slice(2,15);
                onMessagesUpdates(() => pubsub.publish(channel, { curr_room }));
                setTimeout(() => pubsub.publish(channel, { curr_room }), 0);
                return pubsub.asyncIterator(channel);
            }
        }
        // messagesByRoom: {
        //     subscribe: (parent, args, { pubsub }) => {
        //         const {room_id} = args;
        //         curr_room_messages = messages.filter((message) => (message.room_id) === room_id);
        //         console.log(messages, curr_room_messages)
        //         const channel = Math.random().toString(36).slice(2,15);
        //         onMessagesUpdates(() => pubsub.publish(channel, { curr_room_messages }));
        //         setTimeout(() => pubsub.publish(channel, { curr_room_messages }), 0);
        //         return pubsub.asyncIterator(channel);
        //     }
        // }
    }
};

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

server.start(({port})=> {
    console.log(`Server on http://localhost:${port}/`)
});