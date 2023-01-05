import { useContext, useEffect, useState } from 'react';
import './AuthModal.css';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import AppContext from '../../contexts/AppContext';

const AuthModal = (props) => {
  const appContextValue = useContext(AppContext);
  const [showRegister, setShowRegister] = useState(false);
  
  const [warningMessage, setWarningMessage] = useState("")
  const [showSnackBar, setShowSnackBar] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const updateFields = (event) => {
    const {name, value} = event.target;
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: value
      }
    })
  }

  const signInAnon = (event) => {
    event.preventDefault();

    signInAnonymously(auth).then(() => {
      props.hideModal();
    });
  }
  
  const checkFields = (formData) => {
    const {username, email, password} = formData;
    if (showRegister) {
      if (username === "" || email === "" || password === "") {
        setWarningMessage("Please fill in all fields");
        setShowSnackBar(true);
        return false;
      } else {
        return true;
      }
    } else {
      if (email === "" || password === "") {
        setWarningMessage("Please fill in all fields");
        setShowSnackBar(true);
        return false;
      } else {
        return true;
      }
    }
  }

  const checkPassword = (formData) => {
    const {password} = formData;
    if (password.length <= 7) {
      setWarningMessage("Please use a longer password");
      setShowSnackBar(true);
      return false;
    } else {
      return true;
    }
  }

  const register = (event) => {
    event.preventDefault();

    if (checkFields(formData) && checkPassword(formData)) {
      createUserWithEmailAndPassword(auth, formData.email, formData.password).then((user) => {
        sendEmailVerification(user.user)
        const usersRef = doc(db, "users", user.user.uid);
        setDoc(usersRef, {
          username: formData.username,
        });
        props.hideModal();
        formData.username = "";
        formData.email = "";
        formData.password = "";
      }).catch(err => {
        if (err.message === "INVALID_EMAIL") {
          setWarningMessage("Please use a valid email!!");
          setShowSnackBar(true);
          formData.password = "";
        }
      });
    }
  }

  const login = (event) => {
    event.preventDefault();
    
    if (checkFields(formData)) {
      signInWithEmailAndPassword(auth, formData.email, formData.password).then((user) => {
        formData.email = "";
        formData.password = "";
        props.hideModal();
      }).catch(err => {
        if (err === "FirebaseError: Firebase: Error (auth/wrong-password).") {
          setWarningMessage("Wrong password!!");
          setShowSnackBar(true);
          formData.password = "";
        }
      });
    }
  }

  useEffect(() => {
    if (appContextValue.user !== "") {
      props.hideModal()
    };
    setTimeout(() => {
      setShowSnackBar(false);
    }, 3000);
    // eslint-disable-next-line
  }, [showSnackBar, appContextValue.user])

  return (
    <div className={props.show ? "authModal" : "authModal inactive"}>
      <div className="form">
        <div className="title">
          <div className={!showRegister ? "active" : ""} onClick={() => setShowRegister(false)}>
            <span>Sign In</span>
          </div>
          <div className={showRegister ? "active" : ""} onClick={() => setShowRegister(true)}>
            <span>Sign Up</span>
          </div>
        </div>
        <form className="content">
          {showRegister && 
            <div>
              <span>Username</span>
              <input
                name="username"
                value={formData.username}
                onChange={updateFields}
                type="text"
              />
            </div>
          }
          <div>
            <span>Email</span>
            <input
              name="email"
              value={formData.email}
              onChange={updateFields}
              type="email"
            />
          </div>
          <div>
            <span>Password</span>
            <input
              name="password"
              value={formData.password}
              onChange={updateFields}
              type="password"
            />
          </div>
          <button onClick={showRegister ? register : login}>
            <span>{showRegister ? "Register" : "Log In"}</span>
          </button>
          <button className="anon" onClick={signInAnon}>
            <span>Sign In Anonymously</span>
          </button>
          </form>
        {showSnackBar && <span className="warningMessage">{warningMessage}</span>}
      </div>
    </div>
  );
}

export default AuthModal;