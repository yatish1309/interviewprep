const mongoose = require('mongoose');

const company = new  mongoose.Schema({
  section:{
    type:String
  },
  link:{
    type:String
  }
},{timestamp:true});

const cmp = mongoose.model('company', company);

module.exports = cmp;