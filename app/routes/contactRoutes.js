var config      = require('../../config');
var sendMail = require('../helpers/emailHelper');
var wholesaleEmail = config.email.wholesale;
var contactEmail = config.email.contact;

module.exports = function(app, express){

  var contactRouter = express.Router();

  contactRouter.route('/contact')

    .post(function(req, res, next){
      var email = req.body;

      console.log("Contact form: " + email);
      var response = sendMail(contactEmail, email.subject, email.body, email.message, email.from, email.fromName);
      if(response){
        console.log("Contact email failed " + response);
        var emailFailed = new Error("Something went wrong with the email server!");
        emailFailed.status = 500;
        return next(emailFailed);
      }else{
        response = "Your message has been sent! Someone will contact you shortly."
      }
      res.json({
        message: response
      })

    });

  contactRouter.route('/contact/wholesale')
    .post(function(req, res, next){
      var email = req.body;

      console.log("Wholesale request form: " + email);
      var response = sendMail(wholesaleEmail, "Wholesale Customer Request", email.body, email.message, 'noreply@prolowputting.com', 'Pro Low Putting');
      if(response){
        var emailFailed = new Error("Something went wrong with the email server!");
        console.log("Wholesale request email failed " + response);

        emailFailed.status = 500;
        return next(emailFailed);
      }else{
        response = "Your request has been submitted, you will receive an email with login credentials upon approval."
      }
      res.json({
        message: "response"
      })
    });


  return contactRouter;

}
