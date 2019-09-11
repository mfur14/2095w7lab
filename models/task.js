let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    name: String,
    developer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'developer'
    },
    date:{
        type: [Date],
    },
    status:{
        type: String,
        // validate:{  // try array instead
        //     validator: function(value){
        //         return value == "InProgress" || value == "Complete";
        //     },
        //     message: 'Status should be InProgress or Complete'
        // }
    },
    desc: String,
});

let taskModel = mongoose.model('task', taskSchema, 'task'); // ('referancename', schema, 'collectionname')
module.exports = taskModel;