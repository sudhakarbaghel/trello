import { Outlet } from 'react-router-dom';
import './Layout.scss';
import Topbar from './components/topbar/Topbar';

const Layout = () => {
  return (
    <div className="layout">
      <Topbar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
