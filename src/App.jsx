import {BrowserRouter,Routes,Route} from 'react-router-dom'
import React, { useState } from 'react';
import './App.css'
import Login from './components/login/Login'
import { ToastContainer } from 'react-toastify';
import UserLogin from './components/login/UserLogin';
import Create from './components/create/Create';
import { createContext } from 'react';
import Analyze from './components/analyze/Analyze';
// import Profile from './components/profile/Profle';

export const lex_context = createContext();

function App() {
  const [isClick, setIsClick] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storedEmail, setStoredEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [file, setFile] = useState(null);
  const [botName, setBotName] = useState('');
  const [botAliasName, setBotAliasName] = useState('');
  const [bots, setBots] = useState([]);
  const [aliases, setAliases] = useState([]);
  const [files, setFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [selectedBot, setSelectedBot] = useState('');
  const [selectedAlias, setSelectedAlias] = useState('');
  const [showUploadPopup, setShowUploadPopup] = useState(false);
const [newFile, setNewFile] = useState(null);
const [userBots, setUserBots] = useState([]);
const [isCreated, setIsCreated] = useState(
    localStorage.getItem('isCreated') === 'true'
);

const [showCreateForm, setShowCreateForm] = useState(
    localStorage.getItem('isCreated') !== 'true'
);

      
  
  return (
    <>
    <lex_context.Provider value = {{
      isClick,
      bots,
      aliases,
      selectedAlias,
      isCreated,
      setIsClick,
      selectedBot,
      showFiles,
      email,
      files,
      setEmail,
      password,
      setPassword,
      storedEmail,
      setStoredEmail,
      isLoggedIn,
      setIsLoggedIn,
      file,
      setFile,
      botAliasName,
      botName,
      bots,
      setAliases,
      setBotAliasName,
      setBotName,
      setBots,
      setFiles,
      setIsCreated,
      setSelectedAlias,
      setSelectedBot,
      setShowFiles,
      showUploadPopup,
       setShowUploadPopup,
       newFile,
        setNewFile,
        showCreateForm, 
        setShowCreateForm,
        userBots, 
        setUserBots
      }}>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element = {<Login/>}/> 
        <Route path='/user-login' element={<UserLogin/>}/>
        <Route path='/create' element = {<Create/>}/>
        <Route path='/analyze' element = {<Analyze/>}/>
        {/* <Route path='/profile' element = {<Profile/>}/> */}
      </Routes>
      </BrowserRouter>
      </lex_context.Provider>
      <ToastContainer
     position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />
    </>
  )
}

export default App
