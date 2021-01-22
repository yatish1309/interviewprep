const mongoose = require('mongoose');
const cmp = require('../models/companyschema');

const exp = new  mongoose.Schema({
  name:{
    type:String,
    require:true
  },
  photolink:{
    type:String
  },
  branch:{
    type:String,
    require:true,
  },
  year:{
    type:Number,
    require:true,
  },
  company:
  {type: mongoose.Schema.Types.ObjectId, ref: 'company'},
  experience:{
    type:String,
    require:true,
  },
  approved:{
    type:Boolean,
    default:false,
  },
},{timestamp:true});

const e = mongoose.model('exp', exp);

module.exports = e;