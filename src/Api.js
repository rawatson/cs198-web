var _       = require("underscore");
var moment  = require("moment");

var lairState = { enabled: true };
var helpers = [
    { id: 0,
      first_name: "Elmer",
      last_name: "Le",
      sunet_id: "elmerle",
      active: true
    },
    { id: 1,
      first_name: "Omar",
      last_name: "Diab",
      sunet_id: "odiab",
      active: true
    },
    { id: 2,
      first_name: "Rahul",
      last_name: "Gupta-Iwasaki",
      sunet_id: "rahulgi",
      active: false
    },
    { id: 3,
      first_name: "Maesen",
      last_name: "Churchill",
      sunet_id: "maesenc",
      active: false
    }
];
var helpRequests = [
    { id: 1,
      helper_assignment: {
        helper: { person: {
            first_name: "Elmer",
            last_name: "Le",
            sunet_id: "elmerle" } }
      },
      person: {
          first_name: "Daniel",
          last_name: "Steffee"
      },
      position: 0,
      created_at: "May 2 2014",
      course: {
          code: "CS106A",
      }, description: "It broked", location: "19" },
    { id: 2,
      person: {
          first_name: "Robert",
          last_name: "Harlow"
      },
      position: 1,
      created_at: "May 3 2014",
      course: {
          code: "CS106A",
      }, description: "It really broked", location: "9" },
    { id: 3,
      person: {
          first_name: "Amy",
          last_name: "Nguyen"
      },
      position: 2,
      created_at: "May 4 2014",
      course: {
          code: "CS106A",
      }, description: "It broked so hard", location: "23" },
    { id: 4,
      person: {
        first_name: "Mehran",
        last_name: "Sahami"
      },
      course: {
          code: "CS106A"
      },
      close_status: "left", created_at: moment().subtract(10, "minutes"),
      description: "It broked but I'm out", location: "2" }
];

// TODO: actually send AJAX requests
module.exports = {
    Helpers: {
        find: function(opts) {
            if (typeof opts === "undefined") opts = {};
            opts.active = opts.active || true;

            if (opts.active) {
                return new Promise(function(resolve, reject) {
                    var data = _.filter(helpers, function(h) { return h.active; });
                    resolve(data);
                });
            }

            return new Promise(function(resolve, reject) {
                var data = _.filter(helpers, function(h) { return !h.active; });
                resolve(data);
            });
        },
        checkin: function(opts) {
            return new Promise(function(resolve, reject) {
                var match = _.find(helpers, function(h) {
                    return h.id == opts.person_id || h.sunet_id == opts.person_id;
                });

                if (match) {
                    match.active = true;
                    resolve(match);
                } else {
                    reject({ message: "Person not found", statusCode: "404" });
                }
            });
        },
        checkout: function(opts) {
            return new Promise(function(resolve, reject) {
                var match = _.find(helpers, function(h) {
                    return h.id == opts.person_id || h.sunet_id == opts.person_id;
                });

                if (match) {
                    match.active = false;
                    resolve();
                } else {
                    reject({ message: "Person not found", statusCode: "404" });
                }
            });
        },
    },
    LairState: {
        find: function() {
            return new Promise(function(resolve, reject) {
                resolve(lairState);
            });
        },
        update: function(values) {
            return new Promise(function(resolve, reject) {
                lairState = _.extend(lairState, values);
                console.log("updating lair state to: " + lairState);
                resolve(lairState);
            });
        }
    },
    HelpRequests: {
        find: function(opts) {
            if (typeof opts === "undefined") opts = {unassigned: true};
            console.log(JSON.stringify(opts));

            var filters = [];
            if (opts.unassigned) {
                filters.push(function(r) { return !r.helper_assignment; });
            } else if (opts.unassigned === false) {
                filters.push(function(r) { return !!r.helper_assignment; });
            }

            if (opts.closed) {
                filters.push(function(r) { return !!r.close_status; });
            } else {
                filters.push(function(r) { return !r.close_status; });
            }

            if (typeof opts.since !== "undefined") {
                filters.push(function(r) {
                    return moment(r.created_at).isAfter(moment(opts.since));
                });
            }

            return new Promise(function(resolve, reject) {
                var curr = helpRequests;
                for (var filter in filters) {
                    curr = _.filter(curr, filters[filter]);
                }

                resolve(curr);
            });
        }
    }
};
