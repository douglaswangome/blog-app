import { useEffect, useReducer } from 'react';
import './App.css';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import reducer from './reducer';
import AppContext from './contexts/AppContext';
import { doc, getDoc } from 'firebase/firestore';
import { RouterProvider } from 'react-router-dom';
import app_router from './routes/routes';

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    user: "",
    username: "",
  });

  const setUsername = async(user) => {
    const usersRef = doc(db, "users", user.uid);
    const username = await getDoc(usersRef);
    if (username.exists()) {
      dispatch({
        type: "SET_USERNAME",
        username: username.data().username,
      });
    }
  }
  
  useEffect(() => {
    onAuthStateChanged(auth, async(user) => {
      if (user) {
        setUsername(user);
        dispatch({
          type: "SET_USER",
          user: user,
        })
      } else {
        dispatch({
          type: "SIGN_OUT",
          username: "",
          user: ""
        });
      }
    })
  }, [dispatch]);
  
  return (
    <AppContext.Provider value={state}>
      <div className="app">
        <RouterProvider router={app_router} />
      </div>
    </AppContext.Provider>   
  );
}

export default App;