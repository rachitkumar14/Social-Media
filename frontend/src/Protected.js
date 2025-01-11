import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function Protected(props)
{
    const navigate = useNavigate();
    const { Component } = props;
    const [userData , setUserData]=useState([])
    function readData()
    {
    fetch(`${process.env.REACT_APP_API_URL}/userData`,{
            credentials:'include'
         }).then((res)=>{
            res.json().then((result)=>{
                console.log('result',result)
                if(result.message==="fetching data successfully")
                {
                    setUserData(result.user)
                    
                }
                else{
                    localStorage.setItem('token','');      
                    navigate('/login')
                }

                
            })
          })
            const token = localStorage.getItem('token')
       if(!token)
       {
           navigate('/signup')
       }
       else{
        navigate('/')
       }
    }
    useEffect(()=>{
        readData();
     
    },[])
    return(
        <div>
            <Component userData={userData}/>

        </div>
    )
}

export default Protected;