var _       = require("underscore");
var moment  = require("moment");

var apiUrl = "http://prod-env-tfquxfu9vd.elasticbeanstalk.com";
module.exports = {
    Helpers: {
        find: function(id) {
            return $.get(apiUrl + "/lair/helpers/" + id + ".json");
        },
        index: function(opts) {
            return $.get(apiUrl + "/lair/helpers.json", opts);
        },
        checkin: function(person_id) {
            return $.post(apiUrl + "/lair/helpers.json", {
                person: person_id
            });
        },
        checkout: function(helper_id) {
            return $.ajax({
                url: apiUrl + "/lair/helpers/" + helper_id + ".json",
                type: "DELETE"
            });
        },
    },
    LairState: {
        find: function() {
            return $.get(apiUrl + "/lair/status.json");
        },
        update: function(values) {
            return $.ajax({
                url: apiUrl + "/lair/status.json",
                data: values,
                type: "PUT"
            });
        }
    },
    HelpRequests: {
        find: function(id) {
            return $.get(apiUrl + "/lair/help_requests" + id + ".json");
        },
        index: function(opts) {
            return $.get(apiUrl + "/lair/help_requests.json", opts);
        },
        create: function(data) {
            return $.post(apiUrl + "/lair/help_requests.json", data);
        },
        assign: function(request_id, helper_id) {
            return $.post(apiUrl + "/lair/help_requests/" + request_id + "/assignments.json", {
                helper_id: helper_id
            });
        },
        reassign: function(request_id, helper_id) {
            return $.post(apiUrl + "/lair/help_requests/" + request_id +
                          "/assignments/reassign.json", {
                new_helper_id: helper_id
            });
        },
        reopen: function(request_id, helper_id) {
            return $.post(apiUrl + "/lair/help_requests/" + request_id +
                          "/assignments/reopen.json", {
                new_helper_id: helper_id
            });
        },
        resolve: function(request_id, reason) {
            return $.ajax({
                url: apiUrl + "/lair/help_requests/" + request_id + ".json",
                data: {
                    reason: reason
                },
                type: "DELETE"
            });
        }
    },
    People: {
        find: function(id) {
            return $.get(apiUrl + "/people/" + id + ".json");
        }
    },
    Courses: {
        index: function(opts) {
            return $.get(apiUrl + "/courses.json", opts);
        },
    }
};
