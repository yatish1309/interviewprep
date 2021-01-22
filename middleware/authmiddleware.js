const jwt = require('jsonwebtoken');
const User = require('../models/schema');
const names = require('/home/karthik/Downloads/interview prep/adminnames.js');
const bcrypt = require('bcrypt');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'the signup login', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  var i=0;
  if (token) {
    jwt.verify(token, 'the signup login',async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.locals.admin = 0;
        next();
      } else {
        const user = await User.findById(decodedToken.id)
        res.locals.user = user;
        names.forEach((name)=>{
          if(name.password===user.password && name.username === user.username)
          {
            res.locals.admin = 1;
          }else if(name.username==='vijay')
          {
            if(!res.locals.admin)
            {
              res.locals.admin = 0;
            }
          }    
        });
        next();
      }
    });
  }else {
    res.locals.user = null;
    res.locals.admin = 0;
    next();
  }
};

const checkAdmin = (req,res,next)=>{
  const token = req.cookies.jwt;
  var i=0;
  if (token) {
    jwt.verify(token, 'the signup login', async (err, decodedToken) => {
      if (err) {
        res.redirect('/');
      } else {
        let user = await User.findById(decodedToken.id);
        names.forEach((name)=>{
          if(name.password === user.password && name.username === user.username)
          { 
            i=1; 
          } 
        });
        if(i===1)
        {
          next();
        }else{
          res.redirect('/');
        }
      }
    });
  } else {
    res.redirect('/');
  }
};



module.exports = { requireAuth, checkUser,checkAdmin };