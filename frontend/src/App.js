

import { BrowserRouter , Routes , Route } from 'react-router';

import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import Protected from './Protected';
import About from './About';
import Contact from './Contact';
import AddPost from './AddPost';
import EditPost from './EditPost';

import MyProfile from './MyProfile';
import EditProfile from './EditProfile';
import EditProfilePic from './editProfilePic';
import FriendProfile from './FriendProfile';



function App() {
  return (
  <div>
    <BrowserRouter> 
    <Routes>
      <Route path='/' element={<Protected Component={Home}/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/about' element={<Protected Component={About}/>}></Route>
      <Route path='/contact' element={<Protected Component={Contact}/>}></Route>
      <Route path='/services/addPost' element={<Protected Component={AddPost}/>}></Route>
      <Route path='/services/editPost' element={<Protected Component={EditPost}/>}></Route>
      <Route path='/myProfile/:userName' element={<Protected Component={MyProfile}></Protected>}></Route>
      <Route path='/editProfile/:userName' element={<Protected Component={EditProfile}></Protected>}></Route>
      <Route path='/editProfilePic' element={<Protected Component={EditProfilePic}></Protected>}></Route>
      <Route path='/friendProfile/:id' element={<Protected Component={FriendProfile}></Protected>}></Route>
      <Route path='/login' element={<Login/>}></Route>
     
    </Routes>
    </BrowserRouter>

     
         
          
  </div>
  );
}

export default App;
