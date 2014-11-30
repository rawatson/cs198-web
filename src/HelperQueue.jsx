var React = require('react');
var Api = require('./Api.js');
var QueueStatus = require('./QueueStatus.jsx');
var ActiveHelpers = require('./ActiveHelpers.jsx');
var HelpRequests = require('./HelpRequests.jsx');

module.exports = React.createClass({
    REACTIVATE_LEFT_TIMEOUT: 15, // minutes to reactivate reqs from students who left
    refreshState: function() {
        Promise.all([
            Api.LairState.find(),
            Api.HelpRequests.find({ unassigned: true }),
            Api.HelpRequests.find({ left_ago: this.REACTIVATE_LEFT_TIMEOUT }),
            Api.Helpers.find({ active: true })
        ]).then(
            function(values) {
                var lairState = values[0];
                var requests = {
                    unassigned: values[1],
                    left: values[2]
                };
                var helpers = values[3];

                this.setState({
                    requests: requests,
                    queueEnabled: lairState.enabled,
                    helpers: helpers
                });
            }.bind(this), function(error) {
                // TODO : handle errors
            }
        );
    },
    getInitialState: function() {
        return {
            queueEnabled: null,
            requests: null,
            helpers: null
        };
    },
    componentDidMount: function() {
        setTimeout(this.refreshState, 5000);
        this.refreshState();
    },
    updateEnabled: function(enabled) {
        // TODO: AJAX call to affect application state
        this.setState({queueEnabled: enabled});
    },
    render: function() {
        var numRequests = null;
        if (this.state.requests !== null) {
            numRequests = this.state.requests.unassigned.length;
        }

        return (
            <div classname="helper-queue">
                <h1>Helper Queue</h1>
                <QueueStatus enabled={this.state.queueEnabled}
                    numRequests={numRequests}
                    refresh={this.updateEnabled}
                />
                <ActiveHelpers helpers={this.state.helpers}
                    refresh={this.updateActive} />
                <HelpRequests requests={this.state.requests}
                    refresh={this.updateRequests} />
            </div>
        );
    }
});
