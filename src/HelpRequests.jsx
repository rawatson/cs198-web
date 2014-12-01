var React   = require('react');
var _       = require('underscore');

var HelpRequest = require('./HelpRequest.jsx');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            unassignedExpanded: false,
            closedExpanded: false
        };
    },
    toggleExpandMore: function(type) {
        return function(e) {
            e.preventDefault();

            switch(type) {
            case "unassigned":
                return this.setState({unassignedExpanded: !this.state.unassignedExpanded});
            case "closed":
                return this.setState({closedExpanded: !this.state.closedExpanded});
            }
        };
    },
    renderRequestList: function(requests) {
        return (
            <ul>
                {_.map(requests, function(req) {
                    return (
                        <li>
                            <HelpRequest helpers={this.props.helpers} request={req}
                                refresh={this.props.refresh} />
                        </li>);
                 }.bind(this))}
            </ul>
        );
    },
    renderAssigned: function() {
        var elem;
        if (_.isEmpty(this.props.requests.assigned)) {
            elem = <p>No assigned requests.</p>;
        } else {
            elem = this.renderRequestList(this.props.requests.assigned);
        }

        return (
            <div className="requests-assigned">
                <h4>In progress</h4>
                {elem}
            </div>
        );
    },
    renderUnassigned: function() {
        var elems;
        if (_.isEmpty(this.props.requests.unassigned)) {
            elems = [<p>No unassigned requests!</p>];
        } else {
            var moreClass = "requests-more";
            var toggleText;
            if (!this.state.unassignedExpanded) {
                moreClass += " hidden";
                toggleText = "More requests...";
            } else {
                toggleText = "Fewer requests";
            }

            elems = [
                (<HelpRequest helpers={this.props.helpers}
                              request={_.first(this.props.requests.unassigned)}
                              refresh={this.props.refresh}
                    />),
                (<a href=""
                    onClick={this.toggleExpandMore("unassigned").bind(this)}>{toggleText}</a>),
                (
                    <div className={moreClass}>
                        {this.renderRequestList(_.tail(this.props.requests.unassigned))}
                    </div>
                )
            ];
        }

        return (
            <div className="requests-unassigned">
                <h4>Up next:</h4>
                {elems}
            </div>
        );
    },
    renderClosed: function() {
        var elem;
        if (_.isEmpty(this.props.requests.closed_recently)) {
            elem = <p>No recently closed requests.</p>;
        } else {
            elem = this.renderRequestList(this.props.requests.closed_recently);
        }

        var moreClass = "requests-more";
        var toggleText;
        if (!this.state.closedExpanded) {
            moreClass += " hidden";
            toggleText = "Expand...";
        } else {
            toggleText = "Collapse";
        }

        return (
            <div className="requests-closed">
                <h4>Recently closed</h4>
                <a href="" onClick={this.toggleExpandMore("closed").bind(this)}>{toggleText}</a>
                <div className={moreClass}>
                    {elem}
                </div>
            </div>
        );
    },
    render: function() {
        var requestsElem;

        if (this.props.requests === null) {
            requestsElem = (<span>Loading...</span>);
        } else {
            requestsElem = (
                <div className="help-requests-container">
                    {this.renderUnassigned()}
                    {this.renderAssigned()}
                    {this.renderClosed()}
                </div>
            );
        }

        return (
            <div className="help-requests">
                <h3>Help Requests</h3>
                {requestsElem}
            </div>
        );
    }
});
