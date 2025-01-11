
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router";
import { HashLoader } from "react-spinners";

function AddPost(props)
{
    const [postImage,setPostImage]=useState('')
    const [postCaption , setPostCaption]=useState('')
    const [loading,setLoading]=useState(true);
    const navigate = useNavigate()

    function handleInput(e) {
        const file = e.target.files[0];
    
        var reader = new FileReader();
        reader.onload = function () {
          setPostImage(reader.result);
        };
        reader.readAsDataURL(file);
        
     
      };

     async function uploadPost(e)
      {
        e.preventDefault();
        const data = {postImage,postCaption}

        setLoading(false);
         
        await fetch(`http://localhost:8000/addPost`,{
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


                if(resp.message==="Post Added successfully")
                {
                    alert('Post Added successfully')
                   
                    navigate(`/myProfile/${props.userData.userName}`)
                }
                else{
                    alert('Something went wrong in Adding Post')
                  

                }
                setLoading(true);
                
            })
        }).catch((err)=>{
            console.log('error in uploading profile pic at frontend',err)
        })
     
      }

    return(
     
        <div className="profilePic-page bg-black d-flex align-items-center justify-content-center">
        
      <form className="d-flex flex-column border border-solid-white p-5 gap-4">
        <h6 className="text-warning">Add Your Post</h6>
       <input type="file"  name="postImage" onChange={handleInput}/>
       <Form.Group  controlId="formBasicUserName">
                <Form.Control
                  type="text"
                  placeholder="Enter Caption"
                  name="postCaption"
                  onChange={(e)=>setPostCaption(e.target.value)}
              
                />
              </Form.Group>
        
       {
        loading?
        <Button variant="warning" onClick={uploadPost} >Upload Post</Button>
        :
        <Button variant="warning" onClick={uploadPost} className="d-flex gap-1 justify-content-center" > <HashLoader loading={true}  size={28}   /></Button>
       }
      </form>
    </div>
    )
}
export default AddPost;