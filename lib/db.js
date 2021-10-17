var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'rootti',
	database:'test_db'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Yhistetty saatana!');
	}
});

module.exports = connection;