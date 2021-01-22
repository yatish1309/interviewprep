const express = require('express');
const mongoose = require('mongoose');
const {requireAuth,checkUser,checkAdmin} = require('./middleware/authmiddleware')
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const router = require('./src/adminrout');
const control = require('./controllers/contoller');
const multer = require('multer');

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
app.use(express.static('public'));
app.use(cookieParser());

app.use(express.urlencoded({extended: true}));

app.get('*', checkUser);

app.get('/',(req,res)=>{
  console.log("hello:"+res.locals.admin);
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


app.post('/signup',control.signup);
app.post('/login',control.login);

app.get('/randomquestion',control.random);

app.get('/logout',(req,res)=>{
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
})

app.get('/questions',requireAuth,control.questions);
app.get('/companys',requireAuth,control.companys)

app.get('/questions/:topicname',requireAuth,control.topicsGet);
app.get('/companys/:companyname',requireAuth,control.expGet);
app.get('/exp/:id',requireAuth,control.get);

app.post('/questions/:topicname',requireAuth,checkUser,control.topicsPost);
app.post('/companys/:companyname',requireAuth,checkUser,control.expPost);

app.use(checkAdmin);
console.log("hello111");
app.use('/admin', router);





