
import NavBar from "./NavBar";

function About(props)
{


    return(
        <div className="bg-pages">
           <div className="about">
           <NavBar userData={props.userData}/>
          
           <h3 className="text-warning mt-3 mx-3">Hey {props.userData.name}! </h3>
          <div className="mt-4 mx-3">
          <h4 className="text-white">I am Rachit Kumar </h4>
           <h5 className="text-white">I'm a Full Stack Web Developer. I'm passionate about web development</h5>
           <h5 className="text-white">Always eager to learn new technologies and techniques.</h5>
           <h5 className="text-white">My goal is to deliver high-quality web solutions that meet my client's needs and exceed their expectations.</h5>
          </div>
           </div>
        </div>
    )
}
export default About;