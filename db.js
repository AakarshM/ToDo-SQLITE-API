/**
 * Created by Aakarsh on 12/24/16.
 */

var Sequelize = require('sequelize');
//ORM for SQLLITE
var sequelize = new Sequelize(undefined, undefined, undefined, {
    "dialect": "sqlite",
    "storage": __dirname + "/data/todosdb.sqlite"
});

var db = {};  //Object of properties.

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.todo = sequelize.import(__dirname + "/models/todo.js");

module.exports = db;