const mongoose = require('mongoose');

const reference = new mongoose.Schema({
  topic:{
    type:String,
    require:true,
  },
  link:{
    type:String,
    require:true,
  },
},{timestamps:true});

const ref = mongoose.model('reference', reference);

module.exports = ref;
