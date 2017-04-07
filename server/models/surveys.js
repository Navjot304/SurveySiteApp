let mongoose = require('mongoose');

// create a model class
let surveysSchema = mongoose.Schema({
    Question1: String,
    Question2: String,
    Question3: String,
    
},
{
  collection: "surveys"
});

module.exports = mongoose.model('surveys', surveysSchema);
