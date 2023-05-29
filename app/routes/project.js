'use strict';

// Project's routes.
module.exports = function(app) {
	var project = require('../../app/controllers/project');

	app.get("/project/get/:id", project.getProjectData);
	
	/*app.post("/project/startPayment", project.handlePayment);
	app.get("/project/comments/get", project.getComments);
	app.post("/project/comments/save", project.saveComment);
	app.get("/project/articles/get", project.getArticles);
	app.post("/project/articles/save", project.saveArticle);
	app.get("/project/articles/getComments", project.getArticleComments);*/
	//app.post("/project/articles/saveComment", project.saveArticleComments);
};