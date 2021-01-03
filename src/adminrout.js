const AdminBro = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');
const { buildAuthenticatedRouter } = require('admin-bro-expressjs');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/schema');
const {s} = require('../models/sectionschema');
const q = require('../models/questionsschema');
const ref = require('../models/referenceschema');
const session = require('express-session');
AdminBro.registerAdapter(AdminBroMongoose)



const options = {
  resources:[User,s,q,ref],
};

const adminBro = new AdminBro(options)
const ADMIN = {
  email: 'test@example.com',
  password: 'password',
}

const router = buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    if (ADMIN.password === password && ADMIN.email === email) {
      return ADMIN
    }
    return null
  },
  cookieName: 'adminbro',
  cookiePassword: 'somepassword',
} );

module.exports = router;