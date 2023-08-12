const getToken = () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const expires_at = JSON.parse(atob(token.split('.')[1])).exp * 1000;
        return expires_at <= Date.now() ? null : token;
    } catch (err) {
        return null;
    }
};

const getTokenData = () => {
    const token = getToken();
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1])).data;
}

const isAuthenticated = () => getToken() !== null;

const saveToken = (jwt) => {
    try {
        jwt ? localStorage.setItem('token', jwt) : localStorage.removeItem('token');
    } catch (error) {
        console.log(error);
    }
}

export { isAuthenticated, saveToken, getToken, getTokenData };