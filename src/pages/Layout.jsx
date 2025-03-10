import { Outlet, Link } from "react-router-dom";
import "./style/Layout.css";

const Layout = () => {
  return (
    <>
      <nav>
        <div className="nav-content">
          <h1>Mapa škol</h1>
          <ul>
            <li>
              <Link to="/">Mapa</Link>
            </li>
            <li>
              <Link to="/budget">Rozpočet</Link>
            </li>
            <li>
              <Link to="/about">O aplikaci</Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="outlet">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
