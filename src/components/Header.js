import './Header.css';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../contexts/AppContext';

const Header = () => {
  const appContextValue = useContext(AppContext);

  const appContextCheck = () => {
    if (appContextValue.user !== "" && appContextValue.username !== "") {
      return true;
    } else {
      return false;
    }
  }
  
  return (
    <div className="header">
      <div className="logo">
        <span>Doug Blog</span>
      </div>
      
      <div className="links">
        <Link to="/" className="link">
          <span>Home</span>
        </Link>
        <Link 
          to={appContextCheck() ?  `/myblogs/${appContextValue.username}` : "/myblogs"}
          className="link"
        >
          <span>My Blogs</span>
        </Link>
        <Link 
          to={appContextCheck() ?  `/myprofile/${appContextValue.username}` : "/myprofile"}
          className="link"
        >
          <span>My Profile</span>
        </Link>
      </div>
    </div>
  );
}

export default Header;