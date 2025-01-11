import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {  useEffect, useState } from "react";

 import { useNavigate } from "react-router";

function EditProfile(props) {
 
  const [userName, setuserName] = useState(props.userData.userName);
  const [name, setName] = useState(props.userData.name);

  const navigate = useNavigate();
  
  useEffect(()=>{
    readData();
  },[])


  function readData()
    {
    fetch('http://localhost:8000/userData',{
            credentials:'include'
         }).then((res)=>{
            res.json().then((result)=>{
                console.log('result',result)

               setuserName(result.user.userName)
               setName(result.user.name)

                
            })
          })
    }




  async function update(e)
  {
      e.preventDefault();
    const data = {name , userName}
    await fetch(`http://localhost:8000/editProfile/${userName}`,{
        method:"PUT",
        credentials:'include',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data),
    }).then((result)=>{
        result.json().then((resp)=>{
            console.log('Responsed data',resp)
           
            if(resp.message=="user profile edit successfully")
            {
              
                alert('User Edited successfully')
                navigate(`/myProfile/${userName}`)
            }
            else{
                alert('Something went wrong in edit user data')
            
                navigate('/')
            }

        })
    }).catch((err)=>{
        console.log('error in creating user at frontend',err)
    })
  }



  return (

    <div className="bg-black edit-profile">
      <div className=" text-white  d-flex flex-column gap-4  justify-content-center align-items-center">
        <div>
          <h3 className="mx-auto mt-5">Edit Your Profile Data</h3>
        </div>
        <div className="mx-3 border border-solid-dark p-4">
          <Form autoComplete="off">
            <div className="d-flex flex-column gap-2">
              <Form.Group controlId="formBasicUserName">
                <Form.Label className="text-white">User Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Edit UserName"
                  name="userName"
                  value={`${userName}`}
                  onChange={(e) => setuserName(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formBasicName">
                <Form.Label className="text-white">Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Edit Name"
                  name="name"
                  value={`${name}`}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
            </div>

            <div></div>
            <Button
              className="mt-3"
              variant="success"
              type="submit"
              onClick={update}
             
            >
              Update
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default EditProfile;
