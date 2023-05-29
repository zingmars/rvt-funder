'use strict';

// New project's routes.
module.exports = function(app) {
	var newProject = require('../../app/controllers/newproject');
	app.get("/projects/checkstate", newProject.checkActiveProjects);
	app.get("/projects/getGoals", newProject.getGoals);	

	app.post("/projects/savefield", newProject.saveProjectField);
	app.post("/projects/activate", newProject.activateProject);
	app.post("/projects/delete", newProject.deleteProject);
	app.post("/projects/finalise", newProject.finaliseProject);
	app.post("/projects/publish", newProject.publishProject);
	app.post("/projects/setGoal", newProject.setGoal);	
};