var sendMail = require('../helpers/emailHelper');

module.exports = function(app, express){

  var contactRouter = express.Router();

  contactRouter.route('/contact')

    .post(function(req, res, next){

      sendMail('nickleach22@gmail.com', 'WOOT!', 'My Text', 'My HTML', 'youremail@yourdomain.com', 'WOO');

      res.json({
        message: "Email sent yo!"
      })

    });


  return contactRouter;

}
