import './NotFound.css';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="notfound">
      <span>404 ...</span>
      <span>How did you get here?</span>
      <Link to="/">
        <span>Go back home</span>
      </Link>
    </div>
  )
}

export default NotFound