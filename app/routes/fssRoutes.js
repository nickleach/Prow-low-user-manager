var sendMail = require('../helpers/fssEmail');

module.exports = function(app, express){

  var fssRouter = express.Router();

  fssRouter.route('/fss/email')

    .post(function(req, res, next){
      var email = req.body;

      var response = sendMail(email.to, email.subject, email.body, email.message, email.from, email.fromName);
      if(response){
        console.log("Contact email failed " + response);
        var emailFailed = new Error("Something went wrong with the email server!");
        emailFailed.status = 500;
        return next(emailFailed);
      }else{
        response = "Your message has been sent!"
      }
      res.json({
        message: response
      })

    });



  return fssRouter;

}
