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
    renderRequestList: function(requests, opts) {
        if (typeof opts === 'undefined') opts = {};

        return (
            <ul>
                {_.map(requests, function(req) {
                    var elem = <HelpRequest
                        helpers={this.props.helpers}
                        request={req}
                        refresh={this.props.refresh}
                        api={this.props.api} />;
                    if (opts.inProgress) {
                        elem.props.progress = true;
                    }
                    return (<li>{elem}</li>);
                 }.bind(this))}
            </ul>
        );
    },
    renderAssigned: function() {
        var elem;
        if (_.isEmpty(this.props.requests.assigned)) {
            elem = <p>No assigned requests.</p>;
        } else {
            elem = this.renderRequestList(this.props.requests.assigned, {inProgress: true});
        }

        return (
            <div className="request-list requests-assigned">
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
                              highlight={true}
                              api={this.props.api} />)
            ];
            if (!_.isEmpty(_.tail(this.props.requests.unassigned))) {
                elems = elems.concat([
                    (<a href=""
                        onClick={this.toggleExpandMore("unassigned").bind(this)}>{toggleText}</a>),
                    (<div className={moreClass}>
                        {this.renderRequestList(_.tail(this.props.requests.unassigned))}
                    </div>)
                ]);
            }
        }

        return (
            <div className="request-list requests-unassigned">
                <h4>Up next:</h4>
                {elems}
            </div>
        );
    },
    renderClosed: function() {
        var elems;
        if (_.isEmpty(this.props.requests.closed_recently)) {
            elems = [<p>No recently closed requests.</p>];
        } else {
            requestList = this.renderRequestList(this.props.requests.closed_recently);

            var moreClass = "requests-more";
            var toggleText;
            if (!this.state.closedExpanded) {
                moreClass += " hidden";
                toggleText = "Expand...";
            } else {
                toggleText = "Collapse";
            }

            elems = [
                <a href="" onClick={this.toggleExpandMore("closed").bind(this)}>{toggleText}</a>,
                <div className={moreClass}>
                    {requestList}
                </div>
            ];
        }

        return (
            <div className="request-list requests-closed">
                <h4>Recently closed</h4>
                {elems}
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
            <div className="content-pane help-requests">
                {requestsElem}
            </div>
        );
    }
});
