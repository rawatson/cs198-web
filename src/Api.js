module.exports = {
    Helpers: {
        find: function(opts) {
            if (typeof opts === "undefined") opts = {};

            if (opts.active) {
                return new Promise(function(resolve, reject) {
                    var data = [
                        { id: 0,
                          first_name: "Elmer",
                          last_name: "Le",
                          sunet_id: "elmerle"
                        }
                    ];

                    resolve(data);
                });
            }

            return new Promise(function(resolve, reject) {
                resolve([]);
            });
        }
    },
    LairState: {
        find: function() {
            return new Promise(function(resolve, reject) {
                var data = {
                    enabled: true
                };
                resolve(data);
            });
        }
    },
    HelpRequests: {
        find: function(opts) {
            if (typeof opts === "undefined") opts = {};

            if (opts.unassigned) {
                return new Promise(function(resolve, reject) {
                    var requests = [
                        { id: 1,
                          person: {
                              first_name: "Omar",
                              last_name: "Diab"
                          },
                          course: {
                              code: "CS106A",
                          }, description: "It broked", location: "19" },
                        { id: 2,
                          person: {
                              first_name: "Robert",
                              last_name: "Harlow"
                          },
                          course: {
                              code: "CS106A",
                          }, description: "It really broked", location: "9" },
                        { id: 3,
                          person: {
                              first_name: "Amy",
                              last_name: "Nguyen"
                          },
                          course: {
                              code: "CS106A",
                          }, description: "It broked so hard", location: "23" },
                    ];
                    resolve(requests);
                });
            }

            if (typeof opts.left_before !== "undefined") {
                return new Promise(function(resolve, reject) {
                    resolve([
                        { id: 0, person_id: 0, course_id: 1,
                            description: "It broked but I'm out", location: "2" },
                    ]);
                });
            }
        }
    }
};
