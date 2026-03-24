import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/home";
import Search from "./pages/search";
import MapPage from "./pages/mapPage";
import Account from "./pages/account";
import Footer from "./components/footer";

function App() {
  const location = useLocation();
  const hideFooterRoutes = ["/map"];
  const hideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </main>

      {!hideFooter && <Footer />}
    </>
  );
}

export default App;