// import packages
let express = require('express');
let bodyParser = require('body-parser');
let mongodb = require('mongodb');
let morgan = require('morgan');
//let moment = require('moment'); // for date time


// app configurations
let app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('common'));
//app.use(moment);
app.use(express.static('images')); // static images directory <-- no installation required just a directory 
app.use(express.static('css'));  // static css directory
// whats the public method for this?^
app.listen(8888);


// configure mongodb
let MongoDBClient = mongodb.MongoClient;
let url = "mongodb://localhost:27017";

// global variables
let db = null;
let col = null;
let pathName = __dirname+"/views/";

// connect to MongoDB server
MongoDBClient.connect(url, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, client){
    db = client.db('w6lab');
    col = db.collection('tasks');
});

// --- methods ---
app.get('/', function(req, res){  // homepage with links
    res.sendFile(pathName+"index.html");
});

app.get('/alltasks', function(req, res){  // list all tasks page
    col.find({}).toArray(function(err, data){
        res.render('alltasks', {tasksDb :data});  
    });
});

app.get('/newtask', function(req, res){  // new task page
    res.sendFile(pathName+"newtask.html");
});

app.post('/addTask', function(req, res){
    function getNewId() {  // function to generate unique id
        return (Math.floor(100000 + Math.random() * 900000));
    };
    req.body.tId = getNewId();
    myNewTaskObj = {taskId: parseInt(req.body.tId),taskName: req.body.tName, assignTo: req.body.aTo, 
        dueDate: req.body.dDate, status: req.body.tStatus, desc: req.body.tDesc};  
        // have to parse date into date format
    col.insertOne(myNewTaskObj);
    res.redirect("/alltasks"); 
});

app.get('/updatetask', function(req, res){  // update task page
    res.sendFile(pathName+"updatetask.html");
});

app.post('/taskUpdate', function(req, res){  // updates tasks
    let obj = req.body;
    col.updateOne({taskId: parseInt(obj.tId)}, {$set: {status: obj.tStatus}}, {upsert: false}, function(err, result){
        console.log(result);
    });
    res.redirect('/alltasks');
});


app.get('/deletetask', function(req, res){  // delete task page
    res.sendFile(pathName+"deletetask.html");
});

app.post('/deleteTask', function(req, res){
    let obJ = req.body;
    let query = {taskId:  parseInt(obJ.tId)};
    col.deleteOne(query);
    res.redirect('/alltasks');
});

app.get('/deleteCompleted', function(req, res){
    let filter = {status: "Complete"};
    col.deleteMany(filter, function(err, obj){
        console.log(obj);
    });
    res.redirect('/alltasks');
});

app.get('/deleteOldComplete', function(req, res){
    // let filter = {status: "Complete"};
    let filter = { $and: [ { status: "Complete"}, {dueDate: { $lt : "2019-09-04"}}]};
    col.deleteMany(filter, function(err, obj){
        console.log(obj);
    });
    res.redirect('/alltasks');
});

