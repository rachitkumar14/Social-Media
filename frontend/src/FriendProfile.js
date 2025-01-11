import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";

function FriendProfile(props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [myId, setMyId] = useState("");

  const [friendUserName, setFriendUserName] = useState("");
  const [friendProfilePic, setFriendProfilePic] = useState("");
  const [friendPosts, setFriendPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [myComment, setMyComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const handleCloseComment = () => setShowComment(false);
  const [postId, setPostId] = useState("");

  useEffect(() => {
    readData();
  }, []);

  async function readData() {
    await fetch(`http://localhost:8000/friendData/${id}`, {
      credentials: "include",
    }).then((res) => {
      res.json().then((result) => {
        console.log("result", result);
        setFriendUserName(result.data.userName);
        setFriendProfilePic(result.data.profilePic);
        setFriendPosts(result.data.posts);
        setMyId(result.myId._id);
      });
    });
  }

  // Handle Comment

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

  // Show All Comments

  const handleShowComment = (id) => {
    setShowComment(true);
    setPostId(id);

    fetch(`http://localhost:8000/allComments/${id}`, {
      credentials: "include",
    }).then((res) => {
      res.json().then((result) => {
        console.log("result", result);
        if(result.message==="Fetched all comments successfully")
        {
          setComments(result.data.comments);

        }
        else{
          alert('Error in fetch all comments');
        }

       
      });
    });
  };

  // Handle Like Function

  function handleLike(id) {
    fetch(`http://localhost:8000/likePost/${id}`, {
      credentials: "include",
    }).then((res) => {
      res.json().then((resp) => {
        // console.log("result", result);
        //  setLikes(result.data.likes);
      if(resp.message==="done")
      {
        readData();
      }
      else{
        alert('Error in like the post');
      }
      });
    });
  }

  return (
    <div className="friendProfile d-flex">
      <div className="friendProfile-leftPart d-flex flex-column gap-2 align-items-center pt-4">
        <div>
          <img
            src={friendProfilePic}
            alt="my-pic"
            height="130vh"
            width="150vw"
            className="rounded-circle profile-image"
          ></img>
        </div>

        <div className="d-flex text-warning">
          <h3>@</h3>
          <h3 className="friendUserName ">{friendUserName}</h3>
        </div>

        <div className=" text-white mt-2">
          <h3>{friendPosts.length} Posts</h3>
        </div>

        <div className="mt-5 d-flex flex-column gap-3">
          <Button
            onClick={() => navigate(`/myProfile/${myId}`)}
            className="ps-4 pe-4 rounded-pill friendprofileButton"
          >
            My Profile
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="ps-4 pe-4 rounded-pill friendprofileButton"
          >
            Home
          </Button>
        </div>
      </div>
      <div className="frinedProfile-rightPart d-flex flex-column align-items-center">
        <div>
          <h2 className="mt-2">All Posts</h2>
        </div>
        {friendPosts.length === 0 ? (
          <div className="mt-3">
            <div>
              <img
                src="https://i.kym-cdn.com/entries/icons/facebook/000/041/443/New_Project_bhai.jpg"
                alt="no posts"
              ></img>
            </div>
          </div>
        ) : (
          <div className="d-flex w-100 flex-wrap ps-3 pe-3 friendPosts">
            {friendPosts.map((friendPostData, index) => {
              return (
                <div className="d-flex flex-wrap ">
                  <Card key={index} className="ms-4 friendPostCard  mb-4">
                    <Card.Img
                      src={`${friendPostData.postImage}`}
                      className="friendPostImage"
                    />
                    <Card.Body className="body-card d-flex flex-column gap-1">
                      <div className="d-flex gap-2 data">
                        <h6>@{friendUserName}</h6>
                        <h6 className="text-danger">
                          {friendPostData.postCaption}
                        </h6>
                      </div>

                      <div className="d-flex gap-4">
                        <div className="d-flex gap-4">
                          <h5>
                            {friendPostData.likes.length}

                            {friendPostData.likes.includes(myId) ? (
                              <NavLink
                                className="text-decoration-none text-danger"
                                onClick={() => handleLike(friendPostData._id)}
                              >
                                {" "}
                                Likes
                              </NavLink>
                            ) : (
                              <NavLink
                                className="text-decoration-none"
                                onClick={() => handleLike(friendPostData._id)}
                              >
                                {" "}
                                Likes
                              </NavLink>
                            )}
                          </h5>

                          <h6>
                            <NavLink
                              className="text-decoration-none text-black"
                              onClick={() =>
                                handleShowComment(friendPostData._id)
                              }
                            >
                            💬Comment
                            </NavLink>
                          </h6>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
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
                  <h5 className="text-warning"> @{props.userData.userName}</h5>
                 
                 
                  <input
                    type="text "
                    autoComplete="off"
                    name="myComment"
                    className="commentInput"
                    placeholder="Type Your Comment..."
                    onChange={(e) => setMyComment(e.target.value)}
                  ></input>
                  <Button onClick={() => handleComment(postId)}>Submit</Button>
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
                              <h5 className="ms-2">{comment.commentData}</h5>
                            </div>
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
  );
}

export default FriendProfile;
