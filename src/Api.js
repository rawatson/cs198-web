var _       = require("underscore");
var moment  = require("moment");
var $       = require("jquery");

var apiUrl = "http://localhost:3000";
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
    },
    People: {
        find: function(opts) {
            if (typeof opts === "undefined") opts = {};

            if (opts.sunet_id) {
                // TODO: actually run AJAX query for person
                return new Promise(function(resolve, reject) {
                    switch (opts.sunet_id) {
                    case "odiab":
                        return resolve({
                            id: 0,
                            sunet_id: "odiab",
                            first_name: "Omar",
                            courses: [{id: 0, code: "CS106A"}],
                            requests: Promise.resolve([])
                        });
                    case "rawatson":
                        return resolve({
                            id: 1,
                            sunet_id: "rawatson",
                            first_name: "Reid",
                            courses: [{id: 0, code: "CS106A"}, {id: 1, code: "CS106B"}],
                            requests: Promise.resolve([])
                        });
                    case "kmiller4":
                        return resolve({
                            id: 2,
                            sunet_id: "kmiller4",
                            first_name: "Kevin",
                            courses: [{id: 0, code: "CS106A"}],
                            requests: Promise.resolve([{
                                id: 5,
                                course_id: 0,
                                description: "I don't know thing",
                                location: "bathroom",
                                position: 0
                            }])
                        });
                    case "amainero":
                        return resolve({
                            id: 3,
                            sunet_id: "amainero",
                            first_name: "Anthony",
                            courses: [],
                            requests: Promise.resolve([])
                        });
                    default:
                        return reject({
                            status: 404,
                            message: "Person not found"
                        });
                    }
                });
            }

            throw new Error("Not implemented");
        }
    }
};
