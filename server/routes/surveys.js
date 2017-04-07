// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the survey model
let survey = require('../models/surveys');

// create a function to check if the user is authenticated
function requireAuth(req, res, next) {
  // check if the user is logged in
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}


/* GET surveys List page. READ */
router.get('/', requireAuth, (req, res, next) => {
  // find all survey questions in the surveys collection
  survey.find((err, surveys) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('surveys/index', {
        title: 'Surveys',
        surveys: surveys,
        displayName: req.user.displayName
      });
    }
  });

});

//  GET the Survey Details page in order to add a new Survey Question
router.get('/add', requireAuth, (req, res, next) => {

  /*****************
   * ADD CODE HERE *
   *****************/

  res.render('surveys/details', {
    title: "Add a new survey question",
    surveys: '',
    displayName: req.user.displayName
  });

});

// POST process the Survey Details page and create a new Survey Question - CREATE
router.post('/add', requireAuth, (req, res, next) => {

  /*****************
   * ADD CODE HERE *
   *****************/

  let newSurvey = new survey({
    "Question1": req.body.surveyquestion1,
    "Question2": req.body.surveyquestion2,
    "Question3": req.body.surveyquestion3
  });

  survey.create(newSurvey, (err, survey) => {
    console.log(req, res)
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.redirect('/surveys');
    }
  });

});

// GET the Survey Details page in order to edit an existing Survey question
router.get('/:id', requireAuth, (req, res, next) => {

  /*****************
   * ADD CODE HERE *
   *****************/


  try {
    // get a reference to the id from the url
    let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

    // find one survey question by its id
    survey.findById(id, (err, surveys) => {
      if (err) {
        console.log(err);
        res.end(error);
      } else {
        // show the survey details view
        res.render('surveys/details', {
          title: 'Survey Details',
          surveys: surveys,
          displayName: req.user.displayName
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.redirect('/errors/404');
  }

});

// POST - process the information passed from the details form and update the document
router.post('/:id', requireAuth, (req, res, next) => {

  /*****************
   * ADD CODE HERE *
   *****************/

  // get a reference to the id from the url
  let id = req.params.id;

  let updatedSurvey = survey({
    "_id": id,
    "Question1": req.body.surveyquestion1,
    "Question2": req.body.surveyquestion2,
    "Question3": req.body.surveyquestion3
  });

  survey.update({ _id: id }, updatedSurvey, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the Survey List
      res.redirect('/surveys');
    }
  });

});

// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {

  /*****************
   * ADD CODE HERE *
   *****************/
  // get a reference to the id from the url
  let id = req.params.id;

  survey.remove({ _id: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the survey list
      res.redirect('/surveys');
    }
  });


});


module.exports = router;
