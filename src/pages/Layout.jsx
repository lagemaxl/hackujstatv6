import { Outlet, Link } from "react-router-dom";
import "./style/Layout.css";

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <h1>Mapa.jpg</h1>
          <li>
            <Link to="/">Mapa</Link>
          </li>
          <li>
            <Link to="/about">O aplikaci</Link>
          </li>
        </ul>
      </nav>

      <div className="outlet">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
