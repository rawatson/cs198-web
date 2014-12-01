var _       = require("underscore");
var moment  = require("moment");
var $       = require("jquery");

var apiUrl = "http://localhost:3000";
module.exports = {
    Helpers: {
        find: function(opts) {
            return $.get(apiUrl + "/lair/helpers.json");
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
                data: {
                    signup_enabled: values.signup_enabled
                },
                type: "PUT"
            });
        }
    },
    HelpRequests: {
        find: function(opts) {
            return $.get(apiUrl + "/lair/help_requests.json", opts);
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
        resolve: function(request_id, reason) {
            return $.ajax({
                url: apiUrl + "/lair/help_requests/" + request_id + ".json",
                data: {
                    reason: reason
                },
                type: "DELETE"
            });
        }
    }
};
