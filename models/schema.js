const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userschema = new Schema({
  email:{
    type:String,
    require:[true,'please enter an email'],
    unique:true,
    validate:[isEmail,'please enter a valid email'],
    lowercase:true,
  },
  username:{
    type:String,
    require:[true,'please enter a username'],
    unique:true,
  },
  password:{
    type:String,
    require:[true,'please enter a password'],
    minlength:['6','please enter a password of min 6 charecters'],
  }
},{timestamps:true});

userschema.pre('save',async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password,salt);
  next();
});

const User = mongoose.model('user',userschema);
module.exports = User;