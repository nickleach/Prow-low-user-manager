// Build POST String
var querystring = require('querystring');
var https = require('https');

function sendElasticEmail(to, subject, body_text, body_html, from, fromName) {
  // Make sure to add your username and api_key below.
  console.log(to)
  var post_data = querystring.stringify({
    'username' : 'nick@prolowputting.com',
    'api_key': '20c6bdbe-7063-4236-bfef-e25b16c10a85',
    'from': from,
    'from_name' : fromName,
    'to' : to,
    'subject' : subject,
    'body_html' : body_html,
    'body_text' : body_text
  });

  // Object of options.
  var post_options = {
    host: 'api.elasticemail.com',
    path: '/mailer/send',
    port: '443',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    }
  };
  var result = '';
  // Create the request object.
  var post_req = https.request(post_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      result = chunk;
    });
    res.on('error', function (e) {
      result = 'Error: ' + e.message;
    });
  });

  // Post to Elastic Email
  post_req.write(post_data);
  post_req.end();
  return result;
}

module.exports = sendElasticEmail;


//sendElasticEmail('test@test.com', 'My Subject', 'My Text', 'My HTML', 'youremail@yourdomain.com', 'Your Name');


