import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { HashLoader } from "react-spinners";

function EditProfilePic(props) {
  const [profilePic, setProfilePic] = useState("");
  const [loading,setLoading]=useState(true);
  const navigate = useNavigate();

  async function uploadProfilePic(e)
  {
      e.preventDefault();
      // if(!profilePic) return
  try{
    const data = {profilePic};
    console.log('data profile',data)
    setLoading(false);
    
    await fetch(`${process.env.REACT_APP_API_URL}/uploadProfilePic`,{
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
          if(resp.message==="Profile Pic successfully uploaded")
          {
            alert('Pic upload successfully')
            navigate(`/myProfile/${props.userData.userName}`)
            
          }
          else if(resp.message==="default pic")
          {
            navigate(`/myProfile/${props.userData.userName}`)
            
          }
          else{
            alert('something went wrong in uploading profile pic')
          }
          setLoading(true);
            

        })
    }).catch((err)=>{
        console.log('error in uploading profile pic at frontend',err)
    })
  }
  catch(err)
  {
    alert('Error in Uploading Profile pic ')
  }
  }

 function handleInput(e) {
    const file = e.target.files[0];

    var reader = new FileReader();
    reader.onload = function () {
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
    
 
  };

  return (
    <div className="profilePic-page bg-black d-flex align-items-center justify-content-center">
      <form className="d-flex flex-column border border-solid-white p-5 gap-4">
       <input type="file" onChange={handleInput} name="profilePic"/>
        
       {
        loading?
        <Button variant="warning" onClick={uploadProfilePic} >Edit Profile</Button>
        :
        <Button variant="warning" onClick={uploadProfilePic} className="d-flex gap-1 justify-content-center" > <HashLoader loading={true}  size={28}   /></Button>
       }
      </form>
    </div>
  );
}

export default EditProfilePic;
