var React   = require('react');
var moment  = require("moment");
var _       = require("underscore");
var $       = require("jquery");

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
                <h1>Helper Queue</h1>
                <QueueStatus enabled={enabled}
                    numRequests={numRequests}
                    refresh={this.refreshQueueStatus}
                />
                <ActiveHelpers helpers={this.state.helpers}
                    refresh={this.refreshActiveHelpers}
                    staff={true} />
                <HelpRequests helpers={this.state.helpers} requests={this.state.requests}
                    refresh={function() {
                        this.refreshHelpRequests();
                        this.refreshActiveHelpers();
                    }.bind(this)} />
            </div>
        );
    }
});
