import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";

function Login() {

    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 
   async function login(e)
  {
    e.preventDefault();
    if(!email || !password)
    {
        alert('please fill all inputs');
    }
    const data = {  email , password}
        await fetch("http://localhost:8000/login",{
            method:"POST",
            credentials:'include',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data),
        }).then((result)=>{
            result.json().then((resp)=>{
                console.log('Logged user data',resp)
                if(resp.message==="error in Login")
                {
                    alert('Error in this Page')
                    navigate('/signup')
                }
                else if(resp.message==="Something went wrong")
                {
                  alert('something went wrong')
                  navigate('/login')
                }
              else if(resp.message==="user not found")
                {
                  alert('User not found')
                  navigate('/signup')
                }
                else{
                  const token = localStorage.getItem('token')
                  if(!token)
                  {
                    localStorage.setItem('token',resp.token)
                    
                  }
                  navigate('/');
                
                  
                }
    
            })
        }).catch((err)=>{
            console.log('error in creating user at login ',err)
        })


  }
   
  

  return (
    <div className="signup">
      <div className="bg-login text-white  d-flex flex-column gap-5  justify-content-center align-items-center">
        <div>
          <h3 className="mx-auto">Login YourSelf</h3>
        </div>
        <div>
          <Form onSubmit={login} autoComplete="off">
           

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
              Login
            </Button>
            <div>
            <Form.Text className="text-white">
                 <div className="mt-3"> Don't have an account? <NavLink to="/signup">Signup</NavLink></div>
                </Form.Text>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );

}

export default Login;
