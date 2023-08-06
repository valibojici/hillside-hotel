import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const authLink = setContext((request, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: headers?.authorization || (token ? `Bearer ${token}` : ""),
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(createHttpLink({ uri: process.env.REACT_APP_CLIENT_API })),
    cache: new InMemoryCache()
});

const adminClient = new ApolloClient({
    link: authLink.concat(createHttpLink({ uri: process.env.REACT_APP_ADMIN_API })),
    cache: new InMemoryCache()
})

export { client, adminClient };
