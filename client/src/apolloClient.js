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

const clientURI = new URL('/graphql', process.env.REACT_APP_API_BASE_URL);
const client = new ApolloClient({
    link: authLink.concat(createHttpLink({ uri: clientURI })),
    cache: new InMemoryCache()
});

const adminURI = new URL('/graphql/admin', process.env.REACT_APP_API_BASE_URL);
const adminClient = new ApolloClient({
    link: authLink.concat(createHttpLink({ uri: adminURI })),
    cache: new InMemoryCache()
})

export { client, adminClient };
