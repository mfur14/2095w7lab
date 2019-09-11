let mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
    name:{
        firstName:{
            type: String,
            required: true,
        },
        lastName: String
    },
    level:{
        type: String,
        uppercase: true,
        required: true,
        // validate:{   // try array instead
        //     validator: function(value){
        //         return value == "BEGINNER" || value == "EXPERT";
        //     },
        //     message: 'Level should be BEGINNER or EXPERT'
        // }
    },
    address:{
        state: String,
        suburb: String,
        street: Number,
        unit: Number,
    },
});

let developerModel = mongoose.model('developer', developerSchema, 'developer'); // ('referancename', schema, 'collectionname')
module.exports = developerModel;
