var React = require('react');
var Api = require('./Api');

module.exports = React.createClass({
    enabledMessage: function(enabled) {
        if (enabled === null) {
            return "Loading queue status...";
        }

        return "Signups " + (enabled ? "enabled" : "disabled");
    },
    numRequestsMessage: function(numRequests) {
        if (numRequests === 1) {
            return "1 unclaimed request";
        }
        return (numRequests === null ? "?" : numRequests) + " unclaimed requests";
    },
    handleToggleEnabled: function() {
        if (this.props.enabled === null) return;
        var enabled = !this.props.enabled;
        Api.LairState.update({enabled: enabled}).then(function(data) {
            this.props.refresh(data);
        }.bind(this), function(err) {
            //TODO: handle errors
        });
    },
    render: function() {
        // required variables for render
        var numRequestsMessage = this.numRequestsMessage(this.props.numRequests);
        var openStatusMessage = this.enabledMessage(this.props.enabled);
        var toggleEnabled = this.props.enabled !== null;

        return (
            <div className="queue-status">
                <ul>
                    <li><span>{openStatusMessage}</span></li>
                    <li><span>{numRequestsMessage}</span></li>
                    <li><button onClick={this.handleToggleEnabled}
                                disabled={!toggleEnabled}>Toggle</button></li>
                </ul>
            </div>
        );
    }
});
