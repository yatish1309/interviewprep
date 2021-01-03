const AdminBro = require('admin-bro')
const AdminBroMongoose = require('admin-bro-mongoose')

AdminBro.registerAdapter(AdminBroMongoose)


const  User = require('../models/schema');
const  s = require('../models/sectionschema');
const  q = require('../models/questionsschema');


const options = {
  resource : [User,s,q],
};

module.export = options;
