import './App.css'
import { Button} from 'react-bootstrap';
import NavBar from './NavBar';
import {  useNavigate } from 'react-router';

function Home(props)
{
    const navigate = useNavigate();
   // console.log('hello',props.userData);
   
    
    return(
       
        <div className='bg-home' >
         
         <div className='home'>
         <NavBar userData={props.userData}/>
            <h2 className='mt-4 mx-3 head text-warning'>Connect with Others, Share Your Moments!💛</h2>
           <div className='mt-4 d-flex flex-column gap-2'>
           <h4 className='mx-3 title text-white'>A platform to Share Your Photos, Connect with the World!</h4>
           <h5 className='mx-3 sub-title text-white'>Share your favorite photos and be a part of our vibrant community. Get likes, comments on your photos 😉</h5>
           </div>
          <div className=' h-50 d-flex justify-content-center align-items-center'>
         
         <Button onClick={()=>navigate('/services/addPost')} variant='warning' className=' px-5 py-3 rounded-pill  text-dark border border-warning '>Add Your Post</Button>
    
          </div>
         </div>  
        </div>
    )
}
export default Home