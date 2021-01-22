const mongoose = require('mongoose');
const s = require('../models/sectionschema');

const questions = new  mongoose.Schema({
  name:{
    type:String,
    require:true,
    unique:true,
  },
  link:{
    type:String,
    require:true,
    unique:true,
  },
  section:
  {type: mongoose.Schema.Types.ObjectId, ref: 'section'},
  approved:{
    type:Boolean,
    default:false,
  },
},{timestamp:true});

const q = mongoose.model('question', questions);

module.exports = q;