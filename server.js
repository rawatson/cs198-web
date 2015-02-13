// Production web server for the application. For development, instead use:
//     $ npm start
// The development server provides extra features like live code recompilation (if you make changes
// while using this server, they will not be applied).
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
    var options = {root: __dirname + '/public/'};
    res.sendFile('index.html', options);
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});
