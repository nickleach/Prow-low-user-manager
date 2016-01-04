var sendMail = require('../helpers/emailHelper');

module.exports = function(app, express){

  var contactRouter = express.Router();

  contactRouter.route('/contact')

    .post(function(req, res, next){
      var email = req.body;

      console.log("Contact form: " + email);
      var response = sendMail(email.to, email.subject, email.body, email.message, email.from, email.fromName);
      if(response){
        var emailFailed = new Error("Something went wrong with the email server!");
        console.log("Contact email failed " + response);

        emailFailed.status = 500;
        return next(emailFailed);
      }
      res.json({
        message: "Email Sent!"
      })

    });

  contactRouter.route('/contact/wholesale')
    .post(function(req, res, next){
      var email = req.body;

      console.log("Wholesale request form: " + email);
      var response = sendMail(email.to, "Wholesale Customer Request", email.body, email.message, 'nick@prolowputting.com', email.fromName);
      if(response){
        var emailFailed = new Error("Something went wrong with the email server!");
        console.log("Wholesale request email failed " + response);

        emailFailed.status = 500;
        return next(emailFailed);
      }
      res.json({
        message: "Email Sent!"
      })
    });


  return contactRouter;

}
