(function() {
    'use strict';

    var React   = require('react');
    var moment  = require("moment");
    var _       = require("underscore");

    var QueueStatus = require('./QueueStatus.jsx');
    var ActiveHelpers = require('../ActiveHelpers.jsx');
    var HelpRequests = require('./HelpRequests.jsx');

    module.exports = (function(api) {
        return React.createClass({
            REACTIVATE_LEFT_TIMEOUT: 15, // minutes to reactivate reqs from students who left
            REFRESH_RATE: 5000,          // milliseconds to refresh
            refreshState: function() {
                this.refreshActiveHelpers();
                this.refreshHelpRequests();
                this.refreshQueueStatus();
            },
            refreshActiveHelpers: function(data) {
                if (data) return this.setState({ helpers: data });

                api.Helpers.index().then(function(data) {
                    this.setState({ helpers: data.data });
                }.bind(this));
            },
            refreshHelpRequests: function(data) {
                if (data) return this.setState({ requests: data });

                $.when(
                    api.HelpRequests.index(),
                    api.HelpRequests.index({
                        open: false,
                        since: moment().subtract(this.REACTIVATE_LEFT_TIMEOUT, "minutes").utc().format()
                    })
                ).then(function(open, closed_recently) {
                    open = open[0].data;
                    closed_recently = closed_recently[0].data;

                    var isUnassigned = function(r) {
                        return !("helper" in r);
                    };

                    var updatedMoreRecently = function(a, b) {
                        return moment(a.created_at).isBefore(b.created_at) ? 1 : -1;
                    };

                    var requests = {
                        unassigned: _.filter(open, isUnassigned),
                        assigned: _.reject(open, isUnassigned).sort(updatedMoreRecently),
                        closed_recently: closed_recently.sort(updatedMoreRecently)
                    };

                    this.setState({requests: requests});
                }.bind(this));

            },
            refreshQueueStatus: function(data) {
                if (data) return this.setState({ queueStatus: data });

                api.LairState.find().then(function(data) {
                    this.setState({queueStatus: data.data});
                }.bind(this));
            },
            getInitialState: function() {
                return {
                    queueStatus: null,
                    requests: null,
                    helpers: null
                };
            },
            componentDidMount: function() {
                this.refreshInterval = setInterval(this.refreshState, this.REFRESH_RATE);
                this.refreshState();
            },
            componentWillUnmount: function() {
                clearInterval(this.refreshInterval);
            },
            render: function() {
                var numRequests = null;
                if (this.state.requests !== null) {
                    numRequests = this.state.requests.unassigned.length;
                }
                var enabled = null;
                if (this.state.queueStatus !== null) {
                    enabled = this.state.queueStatus.signups_enabled;
                }
                var waitTime = null;
                if (this.state.requests !== null) {
                    if (this.state.requests.unassigned.length === 0) {
                        waitTime = "None!";
                    } else {
                        var lastRequest = _.last(this.state.requests.unassigned);
                        var earliestRequestTime = moment(lastRequest.updated_at);
                        waitTime = moment().toDate() - earliestRequestTime.toDate();
                        waitTime = Math.ceil((waitTime / 1000) / 60);
                        waitTime = waitTime + " minutes";
                    }
                }

                return (
                    <div className="helper-queue">
                        <header className="row title">
                            <h1>Helper Queue</h1>
                        </header>
                        <div className="row">
                            <div className="col-sm-8">
                                <div className="row requests-panel">
                                    <h2>Help requests</h2>
                                    <HelpRequests helpers={this.state.helpers}
                                        requests={this.state.requests}
                                        refresh={function() {
                                            this.refreshHelpRequests();
                                            this.refreshActiveHelpers();
                                        }.bind(this)}
                                        api={api} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="row widget">
                                    <h3>Queue status</h3>
                                    <QueueStatus enabled={enabled}
                                        numRequests={numRequests}
                                        waitTime={waitTime}
                                        refresh={this.refreshQueueStatus}
                                        api={api} />
                                </div>
                                <div className="row widget">
                                    <h3>Active helpers</h3>
                                    <ActiveHelpers helpers={this.state.helpers}
                                        refresh={this.refreshActiveHelpers}
                                        staff={true}
                                        api={api} />
                                </div>
                                <div className="row widget">
                                    <img src="/img/LairMap.png" />
                                </div>
                            </div>
                        </div>
                        <footer className="row">
                            <p className="col-sm-12 feedback-footer">
                                Questions? Requests? Email me at <a href="mailto:osdiab@cs.stanford.edu">
                                    osdiab@cs.stanford.edu</a> or <a
                                    href="https://github.com/cs198/lair-queue/issues/new">
                                    file a Github issue</a>. Thanks!</p>
                        </footer>
                    </div>
                );
            }
        });
    });
}());
