import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";

function Signup() {
    const navigate = useNavigate();
  const [userName, setuserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp(e) {
    e.preventDefault();
     if(!userName || !name || !email || !password)
     {
        alert('Please fill all inputs')
     }

     else{
        const data = {userName, name , email , password}
        await fetch("http://localhost:8000/signup",{
            method:"POST",
            credentials:'include',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data),
        }).then((result)=>{
            result.json().then((resp)=>{
                console.log('Responsed data',resp)
                
                if(resp.message=='something went wrong' || resp.message=="error in signup")
                {
                  alert('Could not Signup')
                }
                else{
                  localStorage.setItem('token',resp.token)
                  navigate('/');
                }
    
            })
        }).catch((err)=>{
            console.log('error in creating user at frontend',err)
        })

     }

   
  }

  return (
    <div className="signup">
      <div className="bg-signup text-white  d-flex flex-column gap-5  justify-content-center align-items-center">
        <div>
          <h3 className="mx-auto">Welcome to Rachit's Website</h3>
        </div>
        <div className="mx-3"> 
          <Form onSubmit={signUp} autoComplete="off">
            <div className="d-flex gap-3">
              <Form.Group className="mb-3 " controlId="formBasicUserName">
                <Form.Label className="text-light">User Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter UserName"
                  name="userName"
                  onChange={(e) => setuserName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label className="text-light">Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
            </div>

            <div>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="text-light">Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Text className="text-warning">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword" >
                <Form.Label className="text-light">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </div>
            <Button variant="success" type="submit">
              Sign Up
            </Button>
            <div>
            <Form.Text className="text-white">
                 <div className="mt-3"> Already have an account? <NavLink to="/login">login</NavLink></div>
                </Form.Text>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default Signup;






