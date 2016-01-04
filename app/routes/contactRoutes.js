var sendMail = require('../helpers/emailHelper');

module.exports = function(app, express){

  var contactRouter = express.Router();

  contactRouter.route('/contact')

    .post(function(req, res, next){
      var email = req.body;

      console.log("Contact form: " + email);
      var response = sendMail(email.to, email.subject, email.body, email.message, email.from, email.fromName);
      if(!response){
        response = "Email Sent!"
      }
      res.json({
        message: response
      })

    });

  contactRouter.route('/contact/wholesale')
    .post(function(req, res, next){
      var email = req.body;

      console.log("Wholesale request form: " + email);
      var response = sendMail(email.to, "Wholesale Customer Request", email.body, email.message, 'nick@prolowputting.com', email.fromName);
      if(!response){
          response = "Email Sent!"
        }
      res.json({
        message: response
      })
    });


  return contactRouter;

}
