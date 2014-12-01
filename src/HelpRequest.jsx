var React   = require('react');
var _       = require('underscore');
var moment  = require("moment");

var Api = require("./Api");

module.exports = React.createClass({
    getInitialState: function() {
        return {hidden: false};
    },
    resolveRequest: function(reason) {
        e.preventDefault();

        Api.HelpRequests.resolve(this.props.request.id, reason).then(function() {
            this.setState({hidden: true});
            this.props.refresh();
        }.bind(this), function(err) {
            // TODO: handle error
            alert(err);
        });
    },
    assignRequest: function() {
        var helper_id = parseInt(this.refs.helper.getDOMNode().value);
        Api.HelpRequests.assign(this.props.request.id, helper_id).then(function() {
            this.setState({hidden: true});
            this.props.refresh();
        }.bind(this), function(err) {
            // TODO: handle error
            alert(err);
        });

    },
    renderHelperOption: function(h) {
        return <option value={h.id}>{h.person.first_name} {h.person.last_name}</option>;
    },
    render: function() {
        var request = this.props.request;
        var elems = [
            <span className="request-student">
                {request.person.first_name} {request.person.last_name}
            </span>,
            <span className="request-description">
                {request.description}
            </span>,
            <span className="request-course">
                {request.course.code}
            </span>,
            <span className="request-location">
                {request.location}
            </span>,
            <span className="request-timestamp">
                {moment(request.created_at).format("h:mm A MMM D, YYYY")}
            </span>,
        ];

        if (request.helper) {
            var helper = request.helper.person;
            elems.push(
                <span className="request-assignment">
                    Assigned to {helper.first_name} {helper.last_name}
                </span>
            );
        } else {
            var availableHelpers = _.filter(this.props.helpers, function(h) {
                return !h.help_request;
            });

            var assignElem;
            if (_.isEmpty(availableHelpers)) {
                assignElem = <span>Cannot assign; all helpers busy.</span>;
            } else {
                var assignRequestHandler = function(e) {
                    e.preventDefault();
                    this.assignRequest();
                }.bind(this);
                assignElem = (
                    <form onSubmit={assignRequestHandler}>
                        <input type="submit" value="Assign to..." />
                        <select ref="helper">
                            {_.map(availableHelpers, this.renderHelperOption)}
                        </select>
                    </form>
                );
            }

            var resolveRequestHandler = function(e) {
                e.preventDefault();
                this.resolveRequest("left");
            }.bind(this);

            elems.push(<button onClick={resolveRequestHandler}>Student left</button>);
            elems.push(assignElem);
        }

        var className = "help-request";
        if (this.state.hidden) {
            className += " hidden";
        }
        return (
            <div class={className}>
                {elems}
            </div>
        );
    }
});
