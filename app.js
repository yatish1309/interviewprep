const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/schema');
const {s} = require('./models/sectionschema');
const q = require('./models/questionsschema');
const ref = require('./models/referenceschema');
const jwt = require('jsonwebtoken');
const {requireAuth,checkUser} = require('./middleware/authmiddleware')
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const router = require('./src/adminrout');

const app = express();

const dbURI = "mongodb+srv://karthik:190123053@cluster0.yowid.mongodb.net/user?retryWrites=true&w=majority"

mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result)=>
  { 
    app.listen(3000);
  })
  .catch((err)=>
  {
    console.log(err);
  });

app.set('view engine','ejs');
app.use('/admin', router);


app.use(express.static('public'));
app.use(cookieParser());

app.use(express.urlencoded({extended: true}));

function rand(i){
  var ran = Math.random()*i;

  return Math.floor(ran);
}

app.get('/',checkUser,(req,res)=>{
  res.render('home.ejs');
});

app.get('/signup',(req,res)=>
{ 
  res.render('signup.ejs',{email:"",username:"",password:""});
});
app.get('/login',(req,res)=>
{ 
  res.render('login.ejs',{email:"",username:"",password:""});
});


app.post('/signup',checkUser ,(req,res)=>{
  const u = new User(req.body);
  u.save()
    .then((result)=>{
      var id = u._id;
      const token = jwt.sign({id},'the signup login', {expiresIn:24*60*60});
      res.cookie('jwt', token, {httpOnly: true, maxAge: 24*60*60*1000});
      res.redirect('/');
    })
    .catch((err)=>
    { var error = {email:'',username:'',password:''};
    if(err.errors)
    {
      Object.values(err.errors).forEach(({properties}) => {
        error[properties.path] = properties.message;
      });
    }
    res.render('signup.ejs',{email:error.email,username:error.username,password:error.password});
     
  });
  
})
app.post('/login',checkUser,(req,res)=>{
  User.findOne({username:req.body.username},(err,result)=>
  { if(err)
    { 
      res.render('login.ejs',{email:"",username:"invalid username",password:""});
    }else
    {
      if(result)
      { 
        bcrypt.compare(req.body.password,result.password)
        .then((r)=>{
          if(r)
          { 
            var id = r._id;
            const token = jwt.sign({id},'the signup login', {expiresIn:24*60*60});
            res.cookie('jwt', token, {httpOnly: true, maxAge: 24*60*60*1000});
            res.redirect('/');
          }else{
            res.render('login.ejs',{email:"",username:"",password:"incorect password"}); 
          }
        })
        .catch((err)=>{
            res.render('login.ejs',{email:"",username:"",password:"incorect password"});
        })
      }else
      { 
        res.render('login.ejs',{email:"",username:"invalid username",password:""});
      }
    }
  });
})

app.get('/randomquestion',async (req,res)=>{
  const ques = await q.find({});
  console.log(ques);
  const count = await q.find().countDocuments();
  console.log(count);
  const i = rand(count);
  console.log(i);
  var j=0;
  ques.forEach(que =>{
    if(j==i)
    {
      res.redirect(que.link);
    }
    j++;
  })
})
app.get('/reference',requireAuth, checkUser, (req,res)=>{
        ref.find({})
        .then((result)=>{
          console.log(result);
          if(result)
          {
            res.render('references.ejs',{result});
          }
        })
        .catch((err)=>{
          console.log(err);
        })
})

app.get('/questions', requireAuth,checkUser ,(req,res)=>{
        s.find({})
        .then((result)=>{
          console.log(result);
          if(result)
          {
            res.render('questions.ejs',{result});
          }
        })
        .catch((err)=>{
          console.log(err);
        })
})

app.get('/questions/:topicname',requireAuth,checkUser,(req,res)=>{
        const name = req.params.topicname;
        console.log(name);
        s.find({section:name})
        .then((result)=>{
          if(result)
          {
            result.forEach((r)=>{
              console.log(r);
              q.find({section:r._id})
              .then((resut) =>{
                console.log(resut);
                if(resut)
                {
                  res.render('topic.ejs',{questions:resut,name});
                }
              })
            })
          }
        })
        .catch((err)=>{
          console.log(err);
        })
})




