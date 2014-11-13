var React = require('react');

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
    render: function() {
        // required variables for render
        var numRequestsMessage = this.numRequestsMessage(this.props.numRequests);
        var openStatusMessage = this.enabledMessage(this.props.enabled);
        var toggleEnabled = this.props.enabled !== null;

        return (
            <div className="queue-status">
                <span>{openStatusMessage}</span>
                <button disabled={!toggleEnabled}>Toggle</button>
            </div>
        );
    }
});
