//import { useParams } from "react-router-dom"
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { Button } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";

import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router";

function MyProfile() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComment, setShowComment] = useState(false);
  const handleCloseComment = () => setShowComment(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //  console.log('hi',props.userData.name)

  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [query, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [myComment, setMyComment] = useState("");
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState("");
  const [postId, setPostId] = useState("");

  useEffect(() => {
    readData();
  }, []);

  // All comments show of the post

  const handleShowComment = (id) => {
    setShowComment(true);
    setPostId(id);

    fetch(`http://localhost:8000/allComments/${id}`, {
      credentials: "include",
    }).then((res) => {
      res.json().then((result) => {
        console.log("result", result);
        setComments(result.data.comments);
      });
    });
  };

  //  Read User Data

  async function readData() {
    await fetch("http://localhost:8000/userData", {
      credentials: "include",
    }).then((res) => {
      res.json().then((result) => {
        console.log("result", result);
        setUserName(result.user.userName);
        setName(result.user.name);
        setUser(result.user);

        setPosts(result.user.posts);
        setUserId(result.user._id);
      });
    });
  }

  // Handle Delete Post Function

  function deletePost(id) {
    fetch(`http://localhost:8000/deletePost/${id}`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      res.json().then((result) => {
        console.log("result", result);
        if (result.message === "post deleted successfully") {
          readData();
        } else {
          console.log(result);
          alert("something went wrong in deleting the post");
        }
      });
    });
  }
  // Handle Like Function

  function handleLike(id) {
    fetch(`http://localhost:8000/likePost/${id}`, {
      credentials: "include",
    }).then((res) => {
      res.json().then(() => {
        // console.log("result", result);
        //  setLikes(result.data.likes);
        readData();
      });
    });
  }

  // Handle Comment Function

  async function handleComment(id) {
    const data = { myComment };

    await fetch(`http://localhost:8000/myComment/${id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((result) => {
        result.json().then((resp) => {
          console.log("Responsed comment data", resp);

          if (resp.message === "comment successfully") {
            setMyComment("");
            handleShowComment(id);
          } else {
            alert("Something went wrong in comment section");
          }
        });
      })
      .catch((err) => {
        console.log("error in commenting  at frontend", err);
      });
  }

  // Delete Comment function

  async function deleteUserComment(id) {
    await fetch(`http://localhost:8000/deleteComment/${id}`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      res.json().then((result) => {
        console.log("result", result);
        if (result.message === "Comment deleted successfully") {
          handleShowComment(postId);
        }
      });
    });
  }

  // Handle Search function

  async function handleSearch() {
    try {
      await fetch("http://localhost:8000/allUsers", {
        credentials: "include",
      }).then((res) => {
        res.json().then((result) => {
          console.log("all users data", result);
          if(result.message==="Data fetch successfully")
          {
            setAllUsers(result.data);
          }
          else{
            alert('Something went wrong');
          }

          
        });
      });
    } catch {
      alert("Something went wrong in Search Friends");
    }
  }

  // Handle Logout Feature

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

  return (
    <div className="profile d-flex ">
      <div className="myProfilePage d-flex flex-column align-items-center  text-warning">
        <div className="myProfileHeading mt-3 ">
          <h3 className="text-white">Your Profile</h3>
        </div>
        <div className="d-flex mt-3 align-items-center w-100 profile-middle ">
          <div className="d-flex flex-column gap-2 align-items-center justify-content-center">
            <div>
              <img
                src={`${user.profilePic}`}
                alt="my-pic"
                height="150px"
                width="150px"
                className="rounded-circle profile-image"
              ></img>
            </div>
            <div>
              <NavLink
                to="/editProfilePic"
                className="text-decoration-none text-info"
              >
                Edit Profile Pic
              </NavLink>
            </div>
          </div>
          <div className=" h-100 pt-3 d-flex flex-column gap-3">
            <div>
              <h3>@{userName}</h3>
              <h6 className="text-white ">{name}</h6>

              {/* <h5 className='text-white'>{email}</h5> */}
            </div>
            <div>
              <Button
                variant="success"
                onClick={() => navigate(`/editProfile/${userName}`)}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
        <div className="posts">
          <div>
            <h3 className="your-posts mt-3 ms-3">Your Posts</h3>
          </div>
          {/* <div><h5>No posts</h5></div> */}

          {/* cards */}
          <div className=" cards bg-black pb-4 ">
            {posts.length === 0 ? (
              <h5 className="text-white">No posts here...😞</h5>
            ) : (
              <div className="d-flex flex-wrap">
                {posts.map((postData, index) => {
                  return (
                    <Card key={index} className="ms-5 postCard mb-4">
                      <Card.Img
                        src={`${postData.postImage}`}
                        className="postImage"
                      />
                      <Card.Body className="body-card d-flex flex-column gap-1">
                        <div className="d-flex gap-2 data">
                          <h6>@{userName}</h6>
                          <h6 className="text-danger">
                            {postData.postCaption}
                          </h6>
                        </div>

                        <div className="d-flex gap-4">
                          <h5>
                            {postData.likes.length}
                            {postData.likes.includes(userId) ? (
                              <NavLink
                                className="text-decoration-none text-danger"
                                onClick={() => handleLike(postData._id)}
                              >
                                {" "}
                                Likes
                              </NavLink>
                            ) : (
                              <NavLink
                                className="text-decoration-none"
                                onClick={() => handleLike(postData._id)}
                              >
                                {" "}
                                Likes
                              </NavLink>
                            )}
                          </h5>

                          <h5>
                            <NavLink
                              className="text-decoration-none text-black"
                              onClick={() => handleShowComment(postData._id)}
                            >
                              💬Comments
                            </NavLink>
                          </h5>

                          {/* Comment offcanvas */}
                        </div>

                        <Button
                          variant="danger"
                          onClick={() => deletePost(postData._id)}
                        >
                          Delete
                        </Button>
                      </Card.Body>
                    </Card>
                  );
                })}
                <Offcanvas
                  show={showComment}
                  onHide={handleCloseComment}
                  placement="bottom"
                  className="bg-black text-white"
                  style={{ height: "70vh" }}
                >
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="text-center w-100  ">
                      <h4>Comments</h4>
                    </Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <span className="d-flex gap-2">
                      <h5 className="text-warning"> @{userName}</h5>
                      <input
                        type="text "
                        autoComplete="off"
                        name="myComment"
                        className="commentInput"
                        placeholder="Type Your Comment..."
                        onChange={(e) => setMyComment(e.target.value)}
                      ></input>
                      <Button onClick={() => handleComment(postId)}>
                        Submit
                      </Button>
                    </span>
                    <div>
                      <h5 className="mt-3 commentsSubHeading">All comments</h5>
                    </div>

                    {comments.length === 0 ? (
                      <h4 className=" text-center text-warning">
                        No Comment Yet 🤷🏾
                      </h4>
                    ) : (
                      <div className="d-flex flex-column ">
                        {comments
                          .slice()
                          .reverse()
                          .map((comment, index2) => {
                            return (
                              <div
                                key={index2}
                                className="text-white d-flex mt-2 w-100  justify-content-between"
                              >
                                <div className="d-flex gap-2">
                                  <img
                                    src={comment.user.profilePic}
                                    height="27px"
                                    width="30px"
                                    className="rounded-circle"
                                  ></img>
                                  <h5 className="text-warning">
                                    {comment.user.userName}
                                  </h5>
                                  <h5 className="ms-2">
                                    {comment.commentData}
                                  </h5>
                                </div>
                                <span className="me-5">
                                  <NavLink
                                    className="text-decoration-none"
                                    onClick={() =>
                                      deleteUserComment(comment._id)
                                    }
                                  >
                                    🗑️
                                  </NavLink>
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </Offcanvas.Body>
                </Offcanvas>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Nav of my Profile page */}

      <div className="w-100 side-nav">
        <Navbar expand="lg" className="bg-black">
          <Container className="d-flex flex-column side-nav-data">
            <h3 className="text-warning side-nav-heading">Features 🎉</h3>
            <div className=" mx-auto d-flex flex-column gap-4 mt-4">
              <Button className="rounded-pill bg-white">
                <NavLink to="/" className="text-dark text-decoration-none ">
                  🏠 Home
                </NavLink>
              </Button>
              <Button className="rounded-pill bg-white">
                <NavLink
                  to="/services/addPost"
                  className="text-dark text-decoration-none"
                >
                  ➕ Add Your Post
                </NavLink>
              </Button>
              <Button className="rounded-pill bg-white" onClick={handleShow}>
                <NavLink
                  className="navs text-dark"
                  onClick={() => handleSearch()}
                >
                  🔎 Search
                 
                </NavLink>
                
              </Button>
              

              <Button
                variant="danger"
                className="rounded-pill mt-5"
                onClick={logout}
              >
                <NavLink className="navs text-white">Log Out</NavLink>
              </Button>

              {/* // hellp */}
              <Offcanvas
                show={show}
                onHide={handleClose}
                className="bg-warning"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title className="mx-auto">
                    <h2>Search</h2>
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="d-flex flex-column  gap-3">
                  {/* Some text as placeholder. In real life you can have the
                  elements you have chosen. Like, text, images, lists, etc. */}

                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="🔎Search Your Friend"
                    className="rounded-pill search-bar"
                    value={query}
                    onChange={(e) =>
                      setSearchQuery(e.target.value.toLowerCase())
                    }
                  />

                  <div className="d-flex flex-column gap-3 ms-3">
                    {allUsers
                      .filter((userData) => {
                        return userData.userName.includes(query);
                      })
                      .map((userData, index) => {
                        return (
                          <div key={index} className="d-flex gap-2" onClick={()=>navigate(`/friendProfile/${userData._id}`)}>
                            <img
                              src={userData.profilePic}
                              height="27px"
                              width="30px"
                              className="rounded-circle"
                              alt="pic"
                            ></img>
                            <h5 className="search-userName">
                              <NavLink className="text-decoration-none text-black">
                                {userData.userName}
                              </NavLink>
                            </h5>
                          </div>
                        );
                      })}
                  </div>
                </Offcanvas.Body>
              </Offcanvas>
            </div>
          </Container>
        </Navbar>
      </div>
    </div>
  );
}
export default MyProfile;
