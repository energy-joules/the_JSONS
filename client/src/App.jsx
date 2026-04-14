import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Home from "./pages/home";
import Search from "./pages/search";
import MapPage from "./pages/mapPage";
import Account from "./pages/account";
import Footer from "./components/Footer";
import RequireAuth from "./auth/RequireAuth";

function App() {
  const location = useLocation();

  const hideNavbarRoutes = ["/login"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  const hideFooterRoutes = ["/map"];
  const hideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/map" element={<MapPage />} />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <Account />
              </RequireAuth>
            }
          />
        </Routes>
      </main>

      {!hideFooter && <Footer />}
    </>
  );
}

export default App;