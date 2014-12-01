var React = require('react');
var moment  = require("moment");

var Api = require('./Api.js');
var QueueStatus = require('./QueueStatus.jsx');
var ActiveHelpers = require('./ActiveHelpers.jsx');
var HelpRequests = require('./HelpRequests.jsx');

module.exports = React.createClass({
    REACTIVATE_LEFT_TIMEOUT: 15, // minutes to reactivate reqs from students who left
    refreshState: function() {
        this.refreshActiveHelpers();
        this.refreshHelpRequests();
        this.refreshQueueStatus();
    },
    refreshActiveHelpers: function(data) {
        if (data) return this.setState({ helpers: data });

        Api.Helpers.find().then(function(data) {
            this.setState({ helpers: data });
        }.bind(this));
    },
    refreshHelpRequests: function(data) {
        if (data) return this.setState({ requests: data });

        Promise.all([
            Api.HelpRequests.find({ unassigned: true }),
            Api.HelpRequests.find({ unassigned: false }),
            Api.HelpRequests.find({
                closed: true,
                since: moment().subtract(this.REACTIVATE_LEFT_TIMEOUT, "minutes")
            }),
        ]).then(function(values) {
            var requests = {
                unassigned: values[0],
                assigned: values[1],
                closed_recently: values[2]
            };

            this.setState({requests: requests});
        }.bind(this));

    },
    refreshQueueStatus: function(data) {
        if (data) return this.setState({ queueStatus: data });

        Api.LairState.find().then(function(data) {
            this.setState({queueStatus: data});
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
        setInterval(this.refreshState, 5000);
        this.refreshState();
    },
    render: function() {
        var numRequests = null;
        if (this.state.requests !== null) {
            numRequests = this.state.requests.unassigned.length;
        }
        var enabled = null;
        if (this.state.queueStatus !== null) {
            enabled = this.state.queueStatus.enabled;
        }

        return (
            <div classname="helper-queue">
                <h1>Helper Queue</h1>
                <QueueStatus enabled={enabled}
                    numRequests={numRequests}
                    refresh={this.refreshQueueStatus}
                />
                <ActiveHelpers helpers={this.state.helpers}
                    refresh={this.refreshActiveHelpers} />
                <HelpRequests helpers={this.state.helpers} requests={this.state.requests}
                    refresh={function() {
                        this.refreshHelpRequests();
                        this.refreshActiveHelpers();
                    }.bind(this)} />
            </div>
        );
    }
});
