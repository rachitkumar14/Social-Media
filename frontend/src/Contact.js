import { useState } from "react";
import NavBar from "./NavBar";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function Contact(props) {

  const [firstName,setFirstName]=useState('');
  const [lastName,setLastName]=useState('');
  const [email,setEmail]=useState('');
  const [city,setCity]=useState('');
  const [query,setQuery]=useState('');

 async function queries(e)
  {
    e.preventDefault();
    if(!firstName || !lastName || !email || !city || !query)
    {
      alert('Please fill all inputs')
    }
    else{
      const data = {firstName , lastName , email , city , query} ;
      await fetch("http://localhost:8000/queries",{
        method:"POST",
        credentials:'include',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data),
    }).then((result)=>{
        result.json().then((resp)=>{
            console.log('Query data',resp)
            
            if(resp.message=="something went wrong" )
            {
              alert('something went wrong');
            }
            if(resp.message = 'Thankyou for contact with us')
            {
              alert('Thankyou for contact with us')
              
            }

        })
    }).catch((err)=>{
        console.log('error in queries in frontend',err)
    })

    }

    


  }


  return (
    <div className="bg-contact">
      <div className="contact">
        <NavBar userData={props.userData} />
        <div className="d-flex flex-column px-4  contact-form justify-content-center align-items-center border border-white ">
          {/* Form start */}
          <h3 className="text-warning">Contact With Us</h3>
          <Form className="mb-5 mt-3">
            <Row className="mb-3">
              <Col>
              <Form.Label className="text-white">First Name</Form.Label>
                <Form.Control placeholder="First name" name="firstName" onChange={(e)=>setFirstName(e.target.value)}/>
              </Col>
              <Col>
              <Form.Label className="text-white">Last Name</Form.Label>
                <Form.Control placeholder="Last name" name="lastName" onChange={(e)=>setLastName(e.target.value)} />
              </Col>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label className="text-white">Email</Form.Label>
                <Form.Control type="email" placeholder="Enter Your Email" name="email" onChange={(e)=>setEmail(e.target.value)} />
              </Form.Group>

             
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label className="text-white">City</Form.Label>
                <Form.Control type="text" placeholder="Enter Your City" name="city" onChange={(e)=>setCity(e.target.value)}/>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridIssue">
                <Form.Label className="text-white">Any Issue</Form.Label>
                <Form.Control type="text" placeholder="Enter Your Issue" name="query" onChange={(e)=>setQuery(e.target.value)}/>
              </Form.Group>
            </Row>

            <Button variant="success" className="mt-2" type="submit" onClick={queries}>
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default Contact;
