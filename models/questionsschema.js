const mongoose = require('mongoose');
const {s,section1} = require('../models/sectionschema');

const questions = new  mongoose.Schema({
  name:{
    type:String,
    require:true,
  },
  link:{
    type:String,
    require:true,
  },
  section:
  {type: mongoose.Schema.Types.ObjectId, ref: 'section'},
},{timestamp:true});

const q = mongoose.model('question', questions);

module.exports = q;