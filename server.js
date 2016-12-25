/**
 * Created by Aakarsh on 12/22/16.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

//app.use(parser.json);

/////////// NOTES OBSERVED:

//res.json(obj) send obj, may or may not be array.
//      If initially obj is an array, then it will send arr. [.....]



var todos = [

]; //Array of todo items




//var todos = [];
var nextTodoItem = 4; //For creating a new ... on top of the existing array.
app.use(bodyParser.json());


app.get('/', function(req, res){
    //console.log("ToDo Root");
    res.send("ToDo Root");
});

//GET REQUEST TO GET ALL TODO ITEMS
        //   GET /todos

app.get('/todos', function (req, res) {
    // Need to send back the array of todos
  //  res.send(todos); //array is converted to JSON. <----- TODOS WITH LOCAL ARRAY

    /////////// TODOS GET WITH DB

    db.todo.findAll({
        where:{
            completed: {$or: [true, false]}
        }

    }).then(function (todosFound) {
        res.json(todosFound);
    });


    ////////// TODOS DONE GET WITH DB



    }

);



//ONLY COMPLETED TRUE TODOS

app.get('/todos/filtered/true', function(req, res){
    //ONLY {completed: true} status todos. //////LOCAL
    /*
    var filteredTrueTodos = _.where(todos, {"completed": true});
    console.log("sending filterd true todos");
    res.send(filteredTrueTodos);
    */


    //////// ONLY COMPLETED:TRUE TODOS WITH DB//

    db.todo.findAll({

        where:{
            completed: true
        }

    }).then(function (todosFound) {
        res.json(todosFound);
    });

    //////// ONLY COMPLETED TRUE DB DONE

});


//ONLY COMPLETED FALSE TODOS
app.get('/todos/filtered/false', function (req, res) {

  /* LOCAL STUFF GET FALSE COMPLETE
    var filteredFalseTodos = _.where(todos, {"completed": false});
    console.log("sending filtered false todos");
    res.send(filteredFalseTodos);

*/

    //////// ONLY COMPLETED:FALSE TODOS WITH DB//

    db.todo.findAll({

        where:{
            completed: false
        }

    }).then(function (todosFound) {
        res.json(todosFound);
    });

    //////// ONLY COMPLETED FALSE DB DONE


});

//Query by some description

app.get('/todos/query/:des', function (req, res){
    var des = "%" + req.params.des + "%";

   /* LOCAL GET BY DESCRIPTION STUFF
    console.log(descriptionToFilter);

    var filteredDesArr = _.filter(todos, function(todo){
        return todo.description.toLowerCase().indexOf(descriptionToFilter.toLowerCase()) != -1;
    });
    res.send(filteredDesArr);


    */


   //////////// FINDALL MATCHING SOME DESCRIPTION SQLITE

    db.todo.findAll({
        where:{
            description:{
                $like: des
            }
        }

    }).then(function (foundTodos) {
            console.log(typeof foundTodos);
            res.json(foundTodos);

    });

    //////////// END OF FOUND TODOS


});



//GET REQUEST TO GET SOME SPECIFIC TODO
        //GET todos/:id
                //Express uses : (colon) to parse data.

app.get('/todos/:id', function (req, res) {
    var todoID = parseInt(req.params.id, 10);

    /* /////// TODOS SEARCH WITH LOCAL ARRAY
     var matchedTodo = _.findWhere(todos, {"id": todoID});
     if(!matchedTodo){
     res.status(404).json({"error": "ID not found"});
     } else{
     res.json(matchedTodo);
     }


     console.log('Asing for todo with id of ' + req.params.id);
     });

     */


    ///////// TODOS SEACH ID WITH SQLITE

    db.todo.findAll({

        where: {
            id: todoID
        }


    }).then(function (foundTodos) {
        res.send(foundTodos);
    });
});


    ///////////////////////



//Create a POST request to create new TODO Items.

        //POST /todos
app.post('/todos', function(req, res){

    ////////////Below is POST with local stuff/NO DB.

    /*
    var body = req.body;
    console.log("description"  + body.description);
    body.id = nextTodoItem++; //The new object
    todos.push(body);
    res.json(todos);
   */


    //////////// BELOW is POST with DB.

    var body = req.body; //Fetch JSON body provided by user.
    db.todo.create({
        description: body.description,
        completed: body.completed

    }).then(function () {
        res.send("Body created in DB");
    });

    //////////// DONE POST WITH DB

});


//DELETE REQUEST

app.delete('/todos/:id', function (req, res) {

    var toDeleteID = req.params.id;

    /* DELETE WITH LOCAL ARRAY
    var toDeleteID = parseInt(req.params.id, 10);
    console.log(toDeleteID);
    var matchedTodo = _.findWhere(todos, {"id": toDeleteID});
    if(!matchedTodo){
        res.status(404).json({"error": "ToDo item not found"});

    } else{

        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }


    res.send('DELETE request to homepage');

    */

    ////////// DELETE WITH DB



    db.todo.destroy({

        where:{

            id: toDeleteID
        }

    }).then(function (todosRemaining) {
        res.json(todosRemaining);
    });



    /////////////// DONE DELETE WITH DB


});

//PUT/PATCH

app.put('/todos/:id', function(req, res){

    /* //// LOCAL ARRAY PUT
    var body = req.body;  ///body data
    var toDoUpdateID = parseInt(req.params.id, 10); //id of the todo to be updated.
    var matchedTodo =_.findWhere(todos, {"id": toDoUpdateID});
    var getObj = _.pick(body, "description", "completed");
    if(!matchedTodo){
        res.status(404).json({"error": "Not found todo item"});

    }




    //console.log(getObj); --> If I put in {"completed": false} prints {completed: false}, omits non-existent values i
    //in the _.pick command. If desciption not found it'll print what I just wrote above.
 else {

         if("completed" in getObj){
                matchedTodo.completed = getObj.completed;

        }
        if("description" in getObj){
                matchedTodo.description = getObj.description;

        }


        res.json(matchedTodo);


    }
     */





    ////////// DB SQLITE PUT OPERATION

    var idToUpdate = parseInt(req.params.id , 10);
    var objectReceived = req.body;

        db.todo.update({
            "description": objectReceived.description,
            "completed": objectReceived.completed
        }, {

            where:{
                id: idToUpdate
            }

        }).then(function () {
            res.send("done patch")
        }).catch(function (e) {
            console.log(e);

        });

    



    ///////////////////// END DB SQLITE PUT OPERATION


});



//Server basic start up (port and log) and intialize sequlize.

db.sequelize.sync().then(function () {
app.listen(3000, function () {
    console.log("Server started");
});
});




