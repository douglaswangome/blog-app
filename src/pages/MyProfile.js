import { useContext, useEffect, useState } from 'react';
import './MyProfile.css';
import Header from "../components/Header";
import AppContext from '../contexts/AppContext';
import { deleteUser, signOut, reauthenticateWithCredential, linkWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth, db } from '../firebase';
import { useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

const MyProfile = () => {
  const [password, setPassword] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const appContextValue = useContext(AppContext);
  const navigate = useNavigate();

  const signUserOut = () => signOut(auth).then(() => navigate("/"));

  const deleteAccount = async() => {
    const blogRef = collection(db, "blogs")
    const blogsQuery = query(blogRef, where("username", "==", appContextValue.username));
    const blogsSnapshot = await getDocs(blogsQuery);
    blogsSnapshot.forEach(document => {
      deleteDoc(doc(db, "blogs", document.id));
    })
    deleteDoc(doc(db, "users", appContextValue.user.uid));

    const credential = EmailAuthProvider.credential(appContextValue.user.email, password);
    reauthenticateWithCredential(auth.currentUser, credential).then(() => {
      deleteUser(appContextValue.user).then(() => {
        navigate("/");
        window.location.reload();
      });
    })
  }

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const updateFields = (event) => {
    const {name, value} = event.target;
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: value,
      }
    })
  }

  const upgradeFromAnon = () => {
    const credential = EmailAuthProvider.credential(formData.email, formData.password);
    linkWithCredential(auth.currentUser, credential).then((user) => {
      const usersRef = doc(db, "users", user.user.uid);
      setDoc(usersRef, {
        username: formData.username,
      });
      appContextValue.username = formData.username;
      setShowUpgrade(false);
      navigate("/");
    }).catch(err => console.log(err));
    
  }

  useEffect(() => {
    if (appContextValue.username === "") {
      setShowUpgrade(true);
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className="myprofile">
      <Header />
      <div className="my_profile">
        <div>
          <span>Username</span>
          <input
            name="username"
            value={showUpgrade ? formData.username : appContextValue.username}
            onChange={updateFields}
            type="text"
            readOnly={!showUpgrade}
          />
        </div>
        <div>
          <span>Email</span>
          <input
            name="email"
            value={appContextValue.user.email === null ? undefined : appContextValue.user.email}
            onChange={updateFields}
            type="email"
            readOnly={!showUpgrade}
          />
        </div>
        {showUpgrade &&
          <>
         <div>
           <span>Password</span>
           <input
             name="password"
             value={formData.password}
             onChange={updateFields}
             type="password"
           />
         </div>
          <div>
            <button onClick={upgradeFromAnon}>
              Upgrade from Anonymous Account
            </button>
          </div>
          </>
        }
        <div>
          <button onClick={signUserOut} className="signOut">
            Sign Out
          </button>
        </div>
        <div>
          <span>By doing this you delete your account info and blogs</span>
          <span>To continue, add your password below</span>
          <input
            value={password}
            onChange={event => setPassword(event.target.value)}
            type="password"
          />
          <input
            disabled={!password}
            onClick={deleteAccount}
            value="Delete Account"
            className="deleteAccount"
            type="button"
          />
        </div>
      </div>
    </div>
  );
}

export default MyProfile;