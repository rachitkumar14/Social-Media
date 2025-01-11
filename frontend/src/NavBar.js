import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { useEffect } from "react";

import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";

import { useState } from "react";


function NavBar(props) {
  const navigate = useNavigate();

  //  console.log('hi',props.userData.name)

  // console.log("pic", `./Images/${props.userData.profilePic}`);
  async function logout() {
    await fetch("http://localhost:8000/logout", {
      credentials: "include",
    }).then((res) => {
      res.json().then((result) => {
        console.log("result", result);
        if (result.message === "logout") {
          alert("Logout");
          localStorage.setItem("token", "");
          navigate("/login");
        }
      });
    });
  }

  const [profilePic , setProfilePic ]=useState('');
    
  useEffect(()=>{
      readData();
  },[])
 async function readData()
  {
 await fetch('http://localhost:8000/userData',{
          credentials:'include'
       }).then((res)=>{
          res.json().then((result)=>{
              setProfilePic(result.user.profilePic)

          })
        })
  }

  return (
    <div>
      <Navbar expand="lg" className="bg-black">
        <Container>
          <Navbar.Brand className="text-white" href="#home">
            Social Media App
          </Navbar.Brand>
          <Navbar.Toggle
            className="bg-white"
            aria-controls="basic-navbar-nav"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto d-flex gap-5">
              <NavLink className="navs" to="/">
                Home
              </NavLink>
              <NavLink className="navs" to="/about">
                About Us
              </NavLink>
              {/* <NavLink className='navs' to="/services">Services</NavLink> */}

             

             
              <NavLink className="navs" to="/contact">
                Contact Us
              </NavLink>
            </Nav>
            <div className="d-flex gap-2">
              <img
                src={`${profilePic}`}
                height="27px"
                width="30px"
                className="rounded-circle"
                alt="pic"
              />
              <NavDropdown
                title={props.userData.name}
                menuVariant="dark"
                className="text-white"
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item >
                <div onClick={()=>navigate(`/myProfile/${props.userData.userName}`)}>My Profile</div>
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  <div className="text-danger" onClick={logout}>
                    Logout
                  </div>
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;
