import { ApolloProvider } from "@apollo/client";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { client, adminClient } from './apolloClient';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import RoomTypes from "./pages/RoomTypes";
import Navbar from "./components/Navbar";
import Reservation from "./pages/Reservation";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { createContext, useState } from "react";
import { getTokenData, saveToken } from "./services/auth";
import RedirectUser from "./routes/RedirectUser";
import RedirectGuest from "./routes/RedirectGuest";
import Logout from "./components/Logout";
import ReservationSummary from "./pages/ReservationSummary";
import ReservationPayment from "./pages/ReservationPayment";
import AdminRoutes from "./routes/AdminRoutes";
import bg from './assets/bg.png';
import './App.css';

export const LoginContext = createContext({});

function App() {
  const [user, setUser] = useState(() => getTokenData());
  const location = useLocation();

  const login = (token) => {
    saveToken(token);
    setUser(getTokenData())
  }

  const logout = () => {
    saveToken(null);
    setUser(null);
  }

  return (
    <>
      <div className="bg-image" style={{ overflowX: 'hidden', minHeight: '100vh', backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundAttachment: 'fixed' }}>
        <ApolloProvider client={location.pathname.startsWith('/admin') ? adminClient : client}>
          <LoginContext.Provider value={{ user: user, login: login, logout: logout }}>
            <Routes>
              <Route path="/" element={<Navbar />} >
                <Route index element={<Home />} />

                <Route element={<RedirectUser to='/' />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                </Route>

                <Route element={<RedirectGuest to='/login' />} >
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/reservation/summary" element={<ReservationSummary />} />
                  <Route path="/reservation/payment" element={<ReservationPayment />} />
                  <Route path="/reservation" element={<Reservation />} />
                </Route>

                <Route path="/rooms" element={<RoomTypes />} />
                <Route path="/about" element={<About />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route path="/admin/*" element={<AdminRoutes />} />

            </Routes>
          </LoginContext.Provider>
        </ApolloProvider>
      </div>
    </>
  );
}

export default App;
