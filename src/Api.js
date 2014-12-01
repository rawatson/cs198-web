var _       = require("underscore");
var moment  = require("moment");

var lairState = { enabled: true };
var people = [
    {
        id: 1,
        first_name: "Rahul",
        last_name: "Gupta-Iwasaki",
        sunet_id: "rahulgi",
        staff: true
    },
    {
        id: 2,
        first_name: "Elmer",
        last_name: "Le",
        sunet_id: "elmerle",
        staff: true
    },
    {
        id: 3,
        first_name: "Maesen",
        last_name: "Churchill",
        sunet_id: "maesenc",
        staff: true
    },
    {
        id: 4,
        first_name: "Omar",
        last_name: "Diab",
        sunet_id: "odiab",
        staff: true
    },
    {
        id: 5,
        first_name: "Daniel",
        last_name: "Steffee",
        sunet_id: "dsteffee",
        staff: false
    },
    {
        id: 6,
        first_name: "Robert",
        last_name: "Harlow",
        sunet_id: "rharlow",
        staff: false
    },
    {
        id: 7,
        first_name: "Amy",
        last_name: "Nguyen",
        sunet_id: "amyng",
        staff: false
    },
    {
        id: 8,
        first_name: "Mehran",
        last_name: "Sahami",
        sunet_id: "msahami",
        staff: false
    },
];

var curHelperId = 3;
var helpers = [
    { id: 0,
      person: {
        id: 2,
        first_name: "Elmer",
        last_name: "Le",
        sunet_id: "elmerle",
      },
      help_request: {
        id: 1,
        person: {
            first_name: "Daniel",
            last_name: "Steffee"
        },
        position: 0,
        created_at: "May 2 2014",
        course: {
            code: "CS106A",
        }, description: "It broked", location: "19"
      }
    },
    { id: 1,
      person: {
        first_name: "Omar",
        last_name: "Diab",
        sunet_id: "odiab",
      }
    },
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

            return new Promise(function(resolve, reject) {
                resolve(helpers);
            });
        },
        checkin: function(person_id) {
            return new Promise(function(resolve, reject) {
                var matchPerson = _.find(people, function(p) {
                    return p.id == person_id || p.sunet_id == person_id;
                });

                if (!matchPerson) {
                    return reject({ message: "Person not found", statusCode: "404" });
                }

                if (!matchPerson.staff) {
                    return reject({ message: "Person not staff", statusCode: "403" });
                }

                var matchHelper = _.find(helpers, function(h) {
                    return h.person.id === person_id || h.person.sunet_id === person_id;
                });

                if (matchHelper) {
                    return resolve(matchHelper);
                }

                var newHelper = {id: curHelperId++, person: matchPerson};
                helpers.push(newHelper);
                resolve(newHelper);
            });
        },
        checkout: function(helper_id) {
            return new Promise(function(resolve, reject) {
                var match = _.find(helpers, function(h) { return h.id == helper_id; });

                if (!match) {
                    return reject({ message: "Helper checkin not found", statusCode: "404" });
                }

                helpers = _.reject(helpers, function(h) { return h.id == helper_id; });
                resolve();
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
                resolve(lairState);
            });
        }
    },
    HelpRequests: {
        find: function(opts) {
            if (typeof opts === "undefined") opts = {unassigned: true};

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
