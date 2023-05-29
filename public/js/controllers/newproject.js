/* global i18next */
/* jshint multistr: true */
'use strict';

angular.module('mean.aboutus').controller('NewProjectController', ['$scope', '$routeParams', '$csrf', 'notify', '$http', '$compile', 'Global', function ($scope, $routeParams, $csrf, notify, $http, $compile, Global) {
    $scope.global = Global;
    Global.page = "newproject";

    $(document).ready(function () {
        // 1. Check auth status
        $http.post("/checkauth")
        	.error(function (res) {     		
        		window.location = "#!/signin";
        	}).success(function (res) { 
        		if(res !== window.user.email) {
        			location.reload();
        		}
    		});
        
        // 2. Get current page
        var section = $(".newProject");
        if(section.length === 1) {
        	switch(section.attr("id")) {
        		case "step2":  fillDataStep2(); break;
        		case "step3":  fillDataStep3(); break;
        		case "step4":  fillDataStep4(); break;
                case "step5":  fillDataStep5(); break;
        		default: {
                    window.location = "/#!/";
                    break;
                }
        	}    	
        } else {
        	window.location = "/#!/"; // Shouldn't ever happen... Oh yes, I just did that.
        }
    });

    // Data logic functions
    function checkProject(callback) {
        //TODO: Offer the user to go to the last page he was on if he's resuming project editing.
        $http.get("/projects/checkstate").error(function (res) {
            notify(i18next.t("discoverPage.connectionError"));            
        }).success(function(res) {                        
            window.projectData = res;
            
            if(callback !== undefined) {
                callback();
            }
        });
    }

    // TODO:
    // Atalgojumu saglabāšana
    // Atalgojumu dzēšana
    // Mērķu pievienošana
    // Mērķu saglabāšana
    // Mērķu dzēšana
    function addGoal(data) {
        var $el = $();
        if(data !== undefined) {
            $el = $('<div class="new-project-goal-wrapper" id="goal-'+data.id+'"><input type="text" class="new-project-goal-title" value="'+data.title+'" placeholder="{{\'newproject.goal\' | i18next}}"> <a class="dropdown-toggle"></a><a class="new-project-goal-remove">(x)</a><div class="new-project-goal noshow"><input type="number" min="0.01" step="0.01" value="'+data.sum+'" class="new-project-goal-title" placeholder="{{\'newproject.goalValue\' | i18next}}"><br /><textarea class="new-project-goal-description" value="'+data.description+'" placeholder="{{\'newproject.goalDescriptionPlaceholder\' | i18next}}"></textarea></div></div>').appendTo("#new-project-goals");
        } else {
            $el = $('<div class="new-project-goal-wrapper" id="goal-"><input type="text" class="new-project-goal-title" placeholder="{{\'newproject.goal\' | i18next}}"> <a class="dropdown-toggle"></a><a class="new-project-goal-remove">(x)</a><div class="new-project-goal noshow"><input type="number" min="0.01" step="0.01" class="new-project-goal-title" placeholder="{{\'newproject.goalValue\' | i18next}}"><br /><textarea class="new-project-goal-description" placeholder="{{\'newproject.goalDescriptionPlaceholder\' | i18next}}"></textarea></div></div>').appendTo("#new-project-goals");
        }
        $compile($el)($scope);

        // Event handlers
        var element = $(".new-project-goal-wrapper:last")[0];
        setUpDrawer(element);

        // Save handlers
    }
    function addReward(data) {
        var $el = $();
        if(data !== undefined) {
            $el = $('<div class="new-project-reward-wrapper" id="reward-'+data.id+'"><input type="text" class="new-project-reward-title" placeholder="{{\'newproject.reward\' | i18next}}" value="'+data.title+'"> <a class="dropdown-toggle"></a><a class="new-project-reward-remove">(x)</a><div class="new-project-reward noshow"><input type="number" min="0.01" step="0.01" value="'+data.sum+'" class="new-project-reward-title" placeholder="{{\'newproject.rewardValue\' | i18next}}"><br /><textarea class="new-project-reward-description" value="'+data.description+'" placeholder="{{\'newproject.rewardDescriptionPlaceholder\' | i18next}}"></textarea><div class="new-project-reward-checkboxes"><input type="checkbox" class="new-project-reward-isLimited" '+((data.isLimitedAmount) ? "checked" : "")+'><span>{{\'newproject.isLimited\' | i18next}} </span><br /></div>\
                <input type="number" value="'+data.limitedAmountCount+'" min="1" step="1" class="new-project-reward-limited" placeholder="{{\'newproject.limitedAmount\' | i18next}}" disabled><br /></div></div>').appendTo("#new-project-rewards");
        } else if($("#reward-").length === 0) {
            $el = $('<div class="new-project-reward-wrapper" id="reward-"><input type="text" class="new-project-reward-title" placeholder="{{ \'newproject.reward\' | i18next }}"> <a class="dropdown-toggle"></a><a class="new-project-reward-remove">(x)</a><div class="new-project-reward noshow">\
                <input type="number" min="0.01" step="0.01" class="new-project-reward-title" placeholder="{{\'newproject.rewardValue\' | i18next}}"><br><textarea class="new-project-reward-description" placeholder="{{\'newproject.rewardDescriptionPlaceholder\' | i18next}}"></textarea>\
                <div class="new-project-reward-checkboxes"><input type="checkbox" class="new-project-reward-isLimited"><span>{{\'newproject.isLimited\' | i18next}} </span><br></div>\
                <input type="number" min="1" step="1" class="new-project-reward-limited" placeholder="{{\'newproject.limitedAmount\' | i18next}}" disabled><br></div></div>').appendTo("#new-project-rewards");
        }
        $compile($el)($scope);
        
        // Event handlers
        var element = $(".new-project-reward-wrapper:last")[0];        
        setUpDrawer(element);
        $(element).find(".new-project-reward-isLimited:checkbox").change(function (event) {
            if($(event.currentTarget).is(":checked")) {
                $(element).find(".new-project-reward-limited").prop('disabled', false);
            } else {
                $(element).find(".new-project-reward-limited").prop('disabled', true);
            }
        });

        // Save handlers

        return element;
    }
    function setUpDrawer(element) {
        $(element).find(".dropdown-toggle").on("click", function(element) {            
            //TODO: Change dropdown icon.
            //TODO: Animation
            $(element.currentTarget).parent().find("div").toggleClass("noshow");
        });
        $(element).find(".new-project-reward-remove").on("click", function(event) {removeReward($(event.currentTarget));});  
    }
    function removeReward(element) {        
        if(element.parent().attr("id") === "reward-" || element.parent().attr("id") === "goal-") {
            element.parent().remove();
        } else {            
            $http({
                method: 'POST',
                url: 'projects/deleteGoal',
                data: {}
            }).then(function(response){
                if(response.data === "Success") {
                    element.parent().remove();
                } else {
                    notify(i18next.t("discoverPage.connectionError"));
                }
            });
        }
    }
    function getGoals() {
        $http({
            method: 'GET',
            url: 'projects/getGoals',                
        }).then(function (response) {
            if(response.statusText === "OK") {
                response.data.forEach(function (reward) {
                    if(reward.isReward) {
                        addReward(reward);
                    } else {
                        addGoal(reward);
                    }
                });
            } else {
                notify(i18next.t("discoverPage.connectionError"));
            }            
        });
    }
    function saveGoal() {

    }

    // Page handlers
    function fillDataStep2() {
        checkProject(function () {
            // Fill the form
            $("#project-name").val(window.projectData.name);
            if(window.projectData.nsfw) {
                $("#new-project-nsfw-checkbox").prop('checked', true);
            }
            $("#project-shortDesc").val(window.projectData.shortDescription);        
            $("#project-category").val(window.projectData.category).change();
            $("#project-expiredate").datetimepicker({
                maskInput: true,
                startDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                endDate: new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000),
                pickTime: false,
                language: 'en'
            }).on('changeDate', function(val) {saveField("expire-date");});
            var picker = $("#project-expiredate").data('datetimepicker');
            picker.setDate(new Date(window.projectData.expireDate));

            // Set up element handlers
            $("#project-name").on("blur", function () {saveField("project-name");});
            $("#project-category").on("change", function () {saveField("project-category");});
            $("#new-project-nsfw-checkbox:checkbox").change(function () {saveField("nsfw", $("#new-project-nsfw-checkbox").is(":checked"));});
            $("#project-shortDesc").on("blur", function () {saveField("project-shortDesc");});
        });
    }
    function checkState() {
        if (window.projectData === undefined) {
            window.location = "/#!/create";
            return false;
        } else {
            return true;
        }
    }
	function fillDataStep3() {
        if(checkState()) {
            // Fill the form
            //TODO: Video and image uploading.
            //TODO: a bb-code based WYSIWYG editor.
            /*CKEDITOR.replace('newproject-text');*/
            $("#newproject-text").val(window.projectData.longDescription);
            $("#successfulMessage").val(window.projectData.successfulMessage);
            $("#succesfulVideoURI").val(window.projectData.succesfulVideoURI);

            // Set up element handlers
            $("#newproject-text").on("blur", function () {saveField("newproject-text");});
            $("#successfulMessage").on("blur", function () {saveField("successfulMessage");});
            $("#successfulVideoURI").on("blur", function () {saveField("successfulVideoURI");});

            // Update the fields from db
            checkProject();
        }
	}
	function fillDataStep4() {
        if(checkState()) {
            // Fill the form
            $("#goal").val(window.projectData.goal);
            getGoals();            

            // Set up element handlers
            $("#addGoal").on("click", function () {addGoal();});
            $("#addReward").on("click", function () {addReward();});
            $("#goal").on("blur", function () {saveField("goal");});
            $("#finalise-project").on("click", function () {
                publishProject();
            });            

            // Update the fields from db
            checkProject();
        }        
    }
    function fillDataStep5() {        
        checkProject(function () {            
            if(window.projectData.id !== parseInt($routeParams.id)) {
                window.location = "/#!/"; // Quite irrelevant since you can't really publish someone else's project, but it keeps the skiddies at bay I guess.
            }

            // Fill the view
            //TODO: Images
            $("#project-name").html(window.projectData.name);
            $("#project-description").html(window.projectData.shortDescription);
            var date = new Date(window.projectData.expireDate);
            $("#project-publish-expiredate").html(date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear());

            // Set up element handlers
            $("#project-view-info-donate-now-text").on("click", function () {
                $http({
                    method: 'POST',
                    url: 'projects/publish'
                }).then(function (response) {
                    if(response.data === "Success") {
                        notify(i18next.t("newproject.publishSuccess"));
                        window.location = "/#!/project/" + window.projectData.id;
                        delete window.projectData;
                    } else {
                        notify(i18next.t("newproject.publishFailure"));
                    }
                });
            });
        });        
    }
    function publishProject() {
        $http({
            method: 'POST',
            url: 'projects/finalise',            
        }).then(function (response) {
            if(response.data === "Success") {       
                notify(i18next.t("newproject.finaliseSuccess"));     
                window.location = "/#!/project/" + window.projectData.id;
                delete window.projectData;
            } else {
                notify(i18next.t("newproject.finaliseFailure"));
            }
        });
    }    

    function saveField(type, value) {
        if (value === undefined) {
            value = $("#"+type).val();
        }

        $http({
            method: 'POST',
            url: 'projects/savefield',
            data: { type: type, value: value }            
        }).then(function (response) {
            if(response.data === "Success") {
                $("#"+type).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
            } else {
                notify(i18next.t("user.saveFailure"));
            }
        });
    }
}]);