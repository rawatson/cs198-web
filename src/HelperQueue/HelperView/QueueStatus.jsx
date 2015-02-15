var React = require('react');

module.exports = React.createClass({
    enableTooltip: function() {
        if (this.refs.enableLink) {
            $(this.refs.enableLink.getDOMNode()).tooltip();
        }
    },
    fixTooltip: function() {
        if (this.refs.enableLink) {
            var link = this.refs.enableLink.getDOMNode();
            $(link).tooltip('fixTitle');
        }
    },
    componentDidMount: function() {
        this.enableTooltip();
    },
    componentDidUpdate: function() {
        this.fixTooltip();
    },
    enabledMessage: function(enabled) {
        if (enabled === null) {
            return <span>Loading queue status...</span>;
        }
        var actionText = (enabled ? "Disable" : "Enable");
        var link = (
            <a href="#" ref="enableLink"
                onClick={this.handleToggleEnabled}
                data-toggle="tooltip"
                data-placement="top"
                title={actionText}>
                {(enabled ? "enabled" : "disabled")}
            </a>);

        return <span>Signups {link}</span>;
    },
    numRequestsMessage: function(numRequests) {
        if (numRequests === 1) {
            return "1 unclaimed request";
        }
        return (numRequests === null ? "?" : numRequests) + " unclaimed requests";
    },
    handleToggleEnabled: function(e) {
        e.preventDefault();
        $(this.refs.enableLink.getDOMNode()).tooltip('hide');

        if (this.props.enabled === null) return;
        var enabled = !this.props.enabled;
        this.props.api.LairState.update({signups_enabled: enabled}).then(function(data) {
            this.props.refresh(data.data);
        }.bind(this), function(err) {
            //TODO: handle errors
            alert("Lair state couldn't be toggled; please refresh and try again.");
            alert(JSON.stringify(err));
        });
    },
    render: function() {
        // required variables for render
        var numRequestsMessage = this.numRequestsMessage(this.props.numRequests);
        var openStatusMessage = this.enabledMessage(this.props.enabled);
        var toggleEnabled = this.props.enabled !== null;

        return (
            <div className="content-pane queue-status">
                <ul>
                    <li>{openStatusMessage}</li>
                    <li><span>{numRequestsMessage}</span></li>
                </ul>
            </div>
        );
    }
});
