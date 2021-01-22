const mongoose = require('mongoose');

const section1 = new  mongoose.Schema({
  section:{
    type:String
  },
  image:{
    type:String
  }
},{timestamp:true});

const s = mongoose.model('section', section1);

module.exports = {s,section1};