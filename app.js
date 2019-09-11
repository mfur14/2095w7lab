// import packages
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');


// app configurations
let app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('images')); // static images directory <-- no installation required just a directory 
app.use(express.static('css'));  // static css directory
app.listen(8888);


// connection to db
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost:27017/w7lab", function (err) {
    if (err) {
        console.log("connection unsuccessful");
        throw err;
    } else {
        console.log("Connected successfully!");
    }
});


// require models
var task = require("./models/task");
var developer = require("./models/developer");
// app.use(express.static('models')); <- is this the same as this ^


// views directory
let pathName = __dirname + "/views/";


// homepage
app.get('/', function (req, res) {  // homepage with links
    res.sendFile(pathName + "index.html");
});


// list tasks 
app.get('/alltasks', function (req, res) {
    task.find().exec(function (err, data) {
        if (err) {
            console.log(err);
            throw err;
        } else {
            console.log(data);
            res.render('alltasks', { tasksDb: data });
        }
    });
});

// add new task
app.get('/newtask', function (req, res) {  // new task page
    res.sendFile(pathName + "newtask.html");
});

app.post('/addTask', function (req, res) {
    task.create({
        name: req.body.tName,
        developer: new mongoose.Types.ObjectId(req.params.aTo),
        date: req.body.dDate,
        status: req.body.tStatus,
        desc: req.body.tDesc,
    }, function (err) {
        if (err) {
            throw err;
        } else {
            console.log(req.body);
            res.redirect('/alltasks');
        }
    });
});


// list developers
app.get("/alldevs", function (req, res) {
    developer.find().exec(function (err, data) {
        if (err) {
            console.log(err);
            throw err;
        } else {
            console.log(data);
            res.render('alldevelopers', { devDb: data });
            //res.send(data);
        }
    });
});

// add new developer
app.get('/newdeveloper', function (req, res) {  // new developer page
    res.sendFile(pathName + "newdeveloper.html");
});

app.post('/adddeveloper', function (req, res) {
    developer.create({
        name: {
            firstName: req.body.fName,
            lastName: req.body.lName
        },
        level: req.body.level,
        address:{
            state: req.body.state,
            suburb: req.body.suburb,
            street: req.body.street,
            unit: req.body.unit
        }
    }, function (err) {
        if (err) {
            throw err;
        } else {
            console.log(req.body);
            res.redirect('/alldevs');
        }
    });
});


// update task by id
app.get('/updatetask', function (req, res) {  // update task page
    res.sendFile(pathName + "updatetask.html");
});

app.post('/taskUpdate', function (req, res) {  // updates tasks
    task.updateOne({ '_id': req.body.tId }, { $set: { 'status': req.body.tStatus } }, function (err) {
        if (err) {
            throw err;
        } else {
            console.log(req.body);
            res.redirect('/alltasks');
        }
    });
});


// delete task by id
app.get('/deletetask', function (req, res) {  // delete task page
    res.sendFile(pathName + "deletetask.html");
});

app.post('/deleteTask', function (req, res) {
    task.deleteOne({ '_id': req.body.tId }, function (err) {
        if (err) {
            throw err;
        } else {
            console.log(req.body);
            res.redirect('/alltasks');
        }
    });
});


// delete all complete tasks
app.get('/deleteCompleted', function (req, res) {
    task.deleteMany({ 'status': 'Complete' }, function (err, doc) {
        if (err) {
            throw err;
        } else {
            console.log(req.body);
            res.redirect('/alltasks');
        }
    });
});


// add  4 tasks
app.get('/4task', function (req, res) {
    res.sendFile(pathName + "fourtask.html");
});

app.post('/4task', function (req, res) {  // we store the object four times in an array, 
    let array = [];                       // and then use the array to create documents in the db, object by object
    for (let i = 0; i < 4; i++) {
        array.push(new task ({
            name: req.body.tName,
            developer: new mongoose.Types.ObjectId(req.params.aTo),
            date: req.body.dDate,
            status: req.body.tStatus,
            desc: req.body.tDesc,
            }));
    };

    console.log("~~",array);

    task.create(array, function (err) {  // no {} because we are not passing an object, but an array
        if (err) {
            throw err;
        } else {
            console.log(req.body);
            // console.log(i);
            res.redirect('/alltasks');
        }
    });
});

