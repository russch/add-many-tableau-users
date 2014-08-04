//modules ==========================================


// Modules for handling xml requests and responses
var jsxml = require("node-jsxml");
var XMLWriter = require('xml-writer');
var request = require("request");

//Variables we'll use throughout the app

// admin username & pw: OF COURSE you won't hard-code these in the real world:
var admin = {username: "admin", password: "adminpw"};

//location of the server
var tableauServer = "http://someMachine"; 

//variable to hold auth token of an admin user so we can do stuff easily
var adminAuthToken;


// Helper functions



var createUser = function(user, callback) {
                        
        var siteID = 'b4126fe9-d7ee-4083-88f9-a5eea1f40416';

        //First, build the XML for the POST
        var userxml = new XMLWriter();
        userxml.startElement('tsRequest').startElement('user')
            .writeAttribute('name', user).writeAttribute('role', 'Interactor')
            .writeAttribute('publish', 'true').writeAttribute('contentAdmin','false')
            .writeAttribute('suppressGettingStarted', 'true');
        request.post( 
            {
                url:  tableauServer + '/api/2.0/sites/' + siteID + '/users/',
                body: userxml.toString(),
                headers: {
                    'Content-Type': 'text/xml',
                    'X-Tableau-Auth': adminAuthToken
                }
            },
            function(err, response, body) {
                if(err) {
                    callback(err);
                    return;
                } else {
                    //If the request was succesful we get xml back that contains the id and name of the added user.
                    var newUserXML = new jsxml.XML(body);
                    //console.log(newUserXML.toString());
                    var userID = newUserXML.child('user').attribute('id').getValue();
                    var userName = newUserXML.child('user').attribute('name').getValue();
                    console.log(userName + " added with user id " + userID);
                }
                callback(null);
                return;
            }
        );	
    }

// Get a token for authenticationf createUser requests
var adminLogin = function (callback){
    // Used to login an admin.username 
	var loginxml = new XMLWriter();
	loginxml.startElement('tsRequest').startElement('credentials').writeAttribute('name', admin.username)
		.writeAttribute('password', admin.password).startElement('site').writeAttribute('contentUrl', '');
	request.post( 
		{
			url: tableauServer + '/api/2.0/auth/signin',
			body: loginxml.toString(),
			headers: {'Content-Type': 'text/xml'}
		},
        // Callback to handle the response 
		function(err, response, body) {
			if(err) {
				callback(err);
				return;
			} else {
				// In order to grab information from the response, we turn it into an xml object and use a module
				// called node-jsxml to parse the xml. node-jsxml allows us to use child(), attribute(), and some other functions
				// to locate specific elements and pieces of information that we need.
				// Here, we need to grab the 'token' attribute and store it in the session cookie.
				var authXML = new jsxml.XML(body);
				try {
                    adminAuthToken = authXML.child('credentials').attribute("token").getValue();
                }
                catch (err)
                {
                    console.log ("Your servername, username or password are incorrect");
                    adminAuthToken = -1;
                }
                
				console.log("Auth token: " + adminAuthToken);
                callback(null);
                return;
            }
        }
    );
    
}



console.log("Application Launching...");
console.log("Logging in....");
adminLogin(function() {
       
        d = new Date();
        n = d.toDateString();
        t = d.toLocaleTimeString();

        console.log("Begin: " + n + ' ' + t);
    
    // Add many users    
    for (i=0;   i < 60000; i++)
        {
            createUser("User " + i.toString(), function(){
                
/*s*/
                
            });
        }
});




