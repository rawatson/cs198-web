var React   = require('react');
var moment  = require("moment");
var _       = require("underscore");

var Api = require('./Api.js');
var QueueStatus = require('./QueueStatus.jsx');
var ActiveHelpers = require('./ActiveHelpers.jsx');
var HelpRequests = require('./HelpRequests.jsx');

module.exports = React.createClass({
    REACTIVATE_LEFT_TIMEOUT: 15, // minutes to reactivate reqs from students who left
    REFRESH_RATE: 5000, // milliseconds to refresh
    refreshState: function() {
        this.refreshActiveHelpers();
        this.refreshHelpRequests();
        this.refreshQueueStatus();
    },
    refreshActiveHelpers: function(data) {
        if (data) return this.setState({ helpers: data });

        Api.Helpers.index().then(function(data) {
            this.setState({ helpers: data.data });
        }.bind(this));
    },
    refreshHelpRequests: function(data) {
        if (data) return this.setState({ requests: data });

        $.when(
            Api.HelpRequests.index(),
            Api.HelpRequests.index({
                open: false,
                since: moment().subtract(this.REACTIVATE_LEFT_TIMEOUT, "minutes").utc().format()
            })
        ).then(function(open, closed_recently) {
            open = open[0].data;
            closed_recently = closed_recently[0].data;

            var isUnassigned = function(r) {
                return !("helper" in r);
            };

            var requests = {
                unassigned: _.filter(open, isUnassigned),
                assigned: _.reject(open, isUnassigned),
                closed_recently: closed_recently
            };

            this.setState({requests: requests});
        }.bind(this));

    },
    refreshQueueStatus: function(data) {
        if (data) return this.setState({ queueStatus: data });

        Api.LairState.find().then(function(data) {
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

        return (
            <div className="helper-queue">
                <header className="row title">
                    <h1>Helper Queue</h1>
                </header>
                <div className="row">
                    <div className="col-sm-8">
                        <div className="row requests-panel">
                            <h2>Help requests</h2>
                            <HelpRequests helpers={this.state.helpers} requests={this.state.requests}
                                refresh={function() {
                                    this.refreshHelpRequests();
                                    this.refreshActiveHelpers();
                                }.bind(this)} />
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="row widget">
                            <h3>Queue status</h3>
                            <QueueStatus enabled={enabled}
                                numRequests={numRequests}
                                refresh={this.refreshQueueStatus} />
                        </div>
                        <div className="row widget">
                            <h3>Active helpers</h3>
                            <ActiveHelpers helpers={this.state.helpers}
                                refresh={this.refreshActiveHelpers}
                                staff={true} />
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
