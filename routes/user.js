exports.user = function(req, res) {
		res.render('user', {title: 'User', id : req.params.id });
};
