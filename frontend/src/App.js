import './App.css';
import {BrowserRouter , Routes , Route } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup';
import Login from './pages/Login';
import Signupconfirmed from './pages/SignupConfirmed';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signupconfirmed' element={<Signupconfirmed />} />


    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
