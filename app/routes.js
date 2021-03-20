/**
 * http://usejsdoc.org/
 */
// app/routes.js
module.exports = function() {
	app.get('/api/', function(req, res) {
		res.send('Test');
	});
}