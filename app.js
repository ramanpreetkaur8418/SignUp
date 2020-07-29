//jshint esversion: 6s

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/cover-page.html");
});

app.get("/sign-up.html", function(req, res){
  res.sendFile(__dirname + "/sign-up.html");
});

app.post("/", function(req, res) {
  const emailInput = req.body.inputEmail;
  const passwordInput = req.body.inputPassword;

  const data = {
    members:[
      {
        email_address: emailInput,
        status: "subscribed",
        merge_fields: {
          PASSWORD: passwordInput
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/f9c087e504"

  const options = {
    method: "post",
    auth: "TAC:25051c75b6d8ddcbc8c3bef869fbc410-us10"
  }

  const request = https.request(url, options, function(response){
    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data){
      const signupData = JSON.parse(data);
      console.log(signupData);
    });
  });

  request.write(jsonData);
  request.end();
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000.");
});




// API KEY: aa7b8c45eb286468628c8965138647d0-us10

// LIST ID: f9c087e504
