const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/schema');
const {s} = require('../models/sectionschema');
const q = require('../models/questionsschema');
const cmp = require('../models/companyschema');
const e = require('../models/experence');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');


function rand(i){
  var ran = Math.random()*i;
  return Math.floor(ran);
}

module.exports.signup = (req,res)=>{
      const u = new User(req.body);
        console.log(req.body);
        u.save()
          .then((result)=>{
            console.log('id');
            console.log(result._id);
            var id = result._id;
            const token = jwt.sign({id},'the signup login', {expiresIn:24*60*60});
            res.cookie('jwt', token, {httpOnly: true, maxAge: 24*60*60*1000});
            res.redirect('/');
          })
          .catch((err)=>
          { var error = {email:'',username:'',password:''};
            if(err.code===11000)
            {
              error.email = "email already registered";
            }
            if(err.errors)
            {
              Object.values(err.errors).forEach(({properties}) => {
                error[properties.path] = properties.message;
              });
            }
            console.log(err);
            res.render('signup.ejs',{email:error.email,username:error.username,password:error.password});
          });  
};



module.exports.login = (req,res)=>{
  console.log(req.body);
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
              var id = result._id;
              console.log(id);
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
};

module.exports.questions = (req,res)=>{
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
};
module.exports.companys = (req,res)=>{
  cmp.find({})
  .then((result)=>{
    if(result)
    {
      res.render('companys.ejs',{result});
    }
  })
  .catch((err)=>{
    console.log(err);
  })
};


module.exports.topicsGet = (req,res)=>{
  const name = req.params.topicname;
  res.locals.lin="";
  res.locals.nam="";
  s.find({section:name})
  .then((result)=>{
    if(result)
    {
      result.forEach((r)=>{
        q.find({section:r._id})
        .then((resut) =>{
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
};

module.exports.expGet = (req,res)=>{
  const name = req.params.companyname;
  res.locals.lin="";
  res.locals.nam="";
  cmp.find({section:name})
  .then((result)=>{
    if(result)
    { 
      result.forEach((r)=>{
        e.find({company:r._id})
        .then((resut) =>{
          if(resut)
          { console.log("resut:"+resut);
            res.render('exp.ejs',{resut,name});
          }
        })
      })
    }
  })
  .catch((err)=>{
    console.log(err);
  })
};

module.exports.topicsPost = (req,res)=>{
  const name = req.params.topicname;
  var u = '';
  console.log("name:"+name);
  s.find({section:name})
  .then((result)=>{
    res.locals.lin="";
    res.locals.nam="";
    console.log("result:"+result[0]._id);
    if(res.locals.admin)
    { console.log('true');
      u = new q({name:req.body.name,link:req.body.link,section:result[0]._id,approved:true});
    }else{
      u = new q({name:req.body.name,link:req.body.link,section:result[0]._id});
    }
    u.save()
    .then((result)=>{
      console.log("result:"+result);
      res.redirect('/questions/'+name);
    }).catch((err)=>{
      errors = {name:"",link:""};  
      if(err.code===11000)
      { if(err.keyPattern.link)
        {
          res.locals.lin = "Question Already Exist";
        }else if(err.keyPattern.name)
        {
          res.locals.nam = "Question Name Already Exist";
        }
      }
      this.topicsGet(req,res);
    });
  }).catch((err)=>{
      res.locals.lin="";
      res.locals.nam="";
      console.log(err);
  })
}

module.exports.expPost = (req,res)=>{
  const name = req.params.companyname;
  var u = '';
  cmp.find({section:name})
  .then((result)=>{
    res.locals.lin="";
    res.locals.nam="";
    if(res.locals.admin)
    { console.log('true');
      u = new e({name:req.body.name,photolink:req.body.photolink,branch:req.body.branch,year:req.body.year,company:result[0]._id,experience:req.body.experience,approved:true});
      console.log("came out1");
    }else{
      u = new e({name:req.body.name,photolink:req.body.photolink,branch:req.body.branch,year:req.body.year,company:result[0]._id,experience:req.body.experience});
      console.log("came out");
    }
    u.save()
    .then((resut)=>{
      console.log("redirecting");
      res.redirect('/companys/'+name);
    }).catch((err)=>{
        errors = {name:"",link:""};  
        if(err.code===11000)
        { if(err.keyPattern.photolink)
          {
            res.locals.lin = "Question Already Exist";
          }else if(err.keyPattern.name)
          {
            res.locals.nam = "Question Name Already Exist";
          }
        }
        console.log(err);
        this.expGet(req,res);
      });
  }).catch((err)=>{
      res.locals.lin="";
      res.locals.nam="";
      console.log(err);
  })
}

module.exports.get = (req,res)=>{
  const id = req.params.id;
  console.log(id);
  e.find({_id:id})
  .then((result)=>{
    console.log(result[0].experience);
    res.render('blog.ejs',{exp:result[0]});
  }).catch((err)=>{
    console.log(err);
  });
}


module.exports.random = async (req,res)=>{
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
}