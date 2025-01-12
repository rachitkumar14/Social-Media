
const express = require('express')
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const database = require('./Config/db.js')
const userModel = require('./Schemas/userSchema.js')
const queryModel = require('./Schemas/queryUserSchema.js')
const postModel = require('./Schemas/postSchema.js');
const isLogged = require('./MiddleWare/isLogged.js')
const commentModel = require('./Schemas/commentSchema.js')
const cloudinary = require('./cloudinary.js')





const bcrypt = require('bcrypt');

const PORT = 8000;

app.use(cors({origin:process.env.frontend_url,credentials:true}))
app.use(express.json({
    limit:"20mb",
}));
app.use(cookieParser())

app.use(express.urlencoded({extended:true}))






app.get('/',(req,res)=>{
    res.send('Welcome to my Social Media App');
})

// SignUp

app.post('/signup',async(req,res)=>{
    try{
        const {name , userName , email , password} = req.body;    
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt,async function(err, hash) {
                if(err)
                {
                    res.status(400).json({
                        message:'something went wrong'
                     })
                    
                }
                else{
                    const user = await userModel.create({
                        name,
                        userName,
                        email,
                        password:hash
                    });
                    const token = jwt.sign({email,userName},process.env.Secret_Key)
                   
            
                    res.cookie('token',token)
                    console.log('token',req.cookies.token)
                     res.status(200).json({
                        message:user,
                        token:token
                     })

                }          

            });
          
        });

    }
    catch(err)
    {
        res.status(500).json({
            message:"error in signup",err
        })

    }
})

// Get particular user data

app.get('/userData',isLogged,async(req,res)=>{

     try{
           const user = await userModel.findOne({email:req.user.email}).populate('posts').select('-password')
          
           res.status(200).json({
            message:"fetching data successfully",user,
            token:req.cookies.token
           })
     }
     catch(err)
     {
        res.status(500).json({
            message:"Error in fetching particular user data",
        })
     }
})

// Edit User Profile Data


app.put('/editProfile/:userName',isLogged,async(req,res)=>{

    try{
        const {name,userName} = req.body;
        const user = await userModel.findOneAndUpdate({email:req.user.email},{name,userName},{new:true})

         res.status(200).json({
            message:"user profile edit successfully",
            data:user
         })

    }
    catch(err)
    {
        res.status(400).json({
            message:"Problem in edit profile",
            error:err
        })
    }

})


// Upload profile Pic

app.post('/uploadProfilePic',isLogged,async(req,res)=>{
  
    try{
        const user = await userModel.findOne({email:req.user.email});
        const {profilePic} = req.body;
        
      if(!profilePic)
      {
       const data = "/Image/default.png"
       user.profilePic = data;
       user.save();
        return res.status(200).json({
            message:"default pic",
            data:data


        })
      }
      else{
        const cloudinary_res = await cloudinary.uploader.upload(profilePic,{
            folder:'/profilePicMiniSocialMedia',
        })

       // console.log(cloudinary_res);
  
         const user = await userModel.findOne({email:req.user.email});
         user.profilePic = cloudinary_res.secure_url;
         user.save();

       return res.status(200).json({
            message:'Profile Pic successfully uploaded',
            data:cloudinary_res
        })
      }


    }
    catch(error)
    {
      return  res.status(400).json({
            message:"error in uploading profile PictureInPictureEvent", error
        })
    }
})

// Add Post

app.post('/addPost',isLogged,async(req,res)=>{

    try{
        const {postImage , postCaption} = req.body;
        const user = await userModel.findOne({email:req.user.email});

        const cloudinary_res = await cloudinary.uploader.upload(postImage,{
            folder:'/postsMiniSocialMedia',
        })

      //  console.log(cloudinary_res);



        const post = await postModel.create({
              postImage:cloudinary_res.secure_url,         
              postCaption,
              user:user._id
        })

      await  user.posts.push(post._id);
      await  user.save();

        res.status(200).json({
            message:"Post Added successfully",
            data:post
        })

    }
    catch(err)
    {
        res.status(400).json({
            message:"error in adding Post",
            error:err
        })
    }
})

// Like Post 

app.get('/likePost/:id',isLogged,async(req,res)=>{
     
    try{
        const post = await postModel.findOne({_id:req.params.id});
        const user = await userModel.findOne({email:req.user.email})

        if(post.likes.indexOf(user._id)===-1)
        {
            post.likes.push(user._id)
        }
        else{
            post.likes.splice(post.likes.indexOf((user._id)),1);
        }
        await post.save();

        res.status(200).json({
            message:"done",
            data:post
        })

    }
    catch(err)
    {
        res.status(500).json({
            message:"Error in like the post",
            error:err
        })
    }
})

// Comment Post

app.post('/myComment/:id',isLogged,async(req,res)=>{
    try{
        const {myComment}=req.body;
        const post = await postModel.findOne({_id:req.params.id});
        const user = await userModel.findOne({email:req.user.email});
        const comment = await commentModel.create({
            commentData:myComment,
            posts:post._id,
            user:user._id
        })

       await post.comments.push(comment._id);
       await post.save();

       res.status(200).json({
        message:"comment successfully",
        commentData:comment
       })  

    }
    catch(err)
    {
        res.status(500).json({
            message:"Error in comment",
            error:err
        })
    }
})

// All User Comments

app.get('/allComments/:id',isLogged,async(req,res)=>{
    try{

        const post = await postModel.findOne({_id:req.params.id}).populate({
            path:'comments',
            populate: {
                // Nested populate - for each comment's user
                path: 'user',
                select: 'name userName profilePic' // Only get these fields
            }
        })
        res.status(200).json({
            message:"Fetched all comments successfully",
            data:post
            
        })

    }
    catch(err)
    {
        res.status(400).json({
            message:"Error in fetch all comments",
            error:err
        })
    }
})

// All Users Data

app.get('/allUsers',isLogged,async(req,res)=>{

    try{
        const users = await userModel.find({}).select('userName profilePic')
        // const userName = users.userName;
        // const profilePic = users.profilePic;

        // const usersData = [{userName,profilePic}]

    res.status(200).json({
        message:"Data fetch successfully",
        data:users
    })

    }
    catch(err)
    {
        res.status(400).json({
            message:"something went wrong in find all users data",
            error:err
        })
    }
})


// Delete user comment

app.delete('/deleteComment/:id',isLogged,async(req,res)=>{
    try{
         
        const comment = await commentModel.findById(req.params.id);
        const postId = comment.posts;

        const post  = await postModel.findById(postId)

        const postComments = post.comments;

          const deletedComment = await commentModel.findByIdAndDelete({_id:req.params.id})
          const indexComment = postComments.indexOf(deletedComment._id);
          console.log(indexComment);

          postComments.splice(indexComment,1);
          post.save();
         
         res.status(200).json({
            message:"Comment deleted successfully",
           
            data:deletedComment
         })

    }
    catch(err)
    {
        res.status(400).json({
            message:"Error in commenting",
            error:err
        })
    }
})




// Delete Post

app.delete('/deletePost/:id',isLogged,async(req,res)=>{

    try{
        const user = await userModel.findOne({email:req.user.email})
        // const post = await postModel.findOne(req.params.id);
      
      

        const deletedPost = await postModel.findOneAndDelete({_id:req.params.id});

        console.log('commetns',deletedPost.comments)

        deletedPost.comments.map(async (commentId)=>{
            return(
                 await commentModel.findByIdAndDelete(commentId)
               
            )
        })
        
       
        await user.posts.splice(user.posts.indexOf((req.params.id)),1);

         await user.save();
        
        res.status(200).json({
            message:"post deleted successfully",
            data:deletedPost
        })

    }
    catch(err)
    {
        res.status(500).json({
            message:'Error in deleting the post',err
            
        })
    }

})


// Friend Data 

app.get('/friendData/:id',isLogged,async(req,res)=>{

    try{
        const user = await userModel.findById(req.params.id).select('userName posts name profilePic').populate({
            path:'posts',
            populate:{
                path:'comments'
            }
           
        })
        const me = await userModel.findOne({email:req.user.email}).select('_id')
       

        res.status(200).json({
            message:"Fetch friend data successfully",
            data:user,
            myId:me
        })
        
        
    }
    catch(err)
    {
        res.status(400).json({
            message:"Error in fetching friend data",
            error:err
        })
    }
})





// Login Page

app.post('/login',async(req,res)=>{
    
    try{
        const {email,password} = req.body
        const loginUser = await userModel.findOne({email})

        if(!loginUser)
        {
           return res.status(400).json({
                message:"user not found"
            })
        }

        bcrypt.compare(password,loginUser.password,(err,result)=>{
            if(result==false)
            {
                res.status(500).json({
                    message:"Something went wrong"
                })

            }
            else{
                const token = jwt.sign({email,userName:loginUser.userName},"rachitthedonishere78dkd7892024#rari")
                res.cookie('token',token)
               // console.log('token',req.cookies.token)
                res.status(200).json({
                    message:loginUser,
                    token:token
                })
            }
        })
    }
    catch(err)
    {
        res.status(500).json({
            message:"error in Login",err
        })

    }

})


// LogOut

app.get('/logout',isLogged,(req,res)=>{
   
    try{
        res.cookie('token','')
       
            res.status(200).json({
                message:'logout'
            })
    }
    catch(err)
    {
    
            res.status(500).json({
                message:'something went wrong',err
            })
    }
    
    
})

// Queries of User

app.post('/queries',async(req,res)=>{

    try{
        const {firstName , lastName , city , email , query }= req.body;
        
         await queryModel.create({
            firstName,
            lastName,
            city,
            email,
            query

        })
        res.status(200).json({
            message:"Thankyou for contact with us"

        })
    }
    catch(err)
    {
        res.status(500).json({
            message:'something went wrong'
        })
    }

})








app.listen(PORT,()=>{
    console.log(`Connected at Port number ${PORT}`)
    database();
})
