const AdminBro = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');
const { buildRouter } = require('admin-bro-expressjs');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/schema');
const {s} = require('../models/sectionschema');
const q = require('../models/questionsschema');
const cmp = require('../models/companyschema');
const e = require('../models/experence');
const session = require('express-session');
AdminBro.registerAdapter(AdminBroMongoose)



const options = {
  resources:[User,s,q,cmp,e],
};

const adminBro = new AdminBro(options)


const router = buildRouter(adminBro);

module.exports = router;