var React   = require('react');
var _       = require('underscore');
var moment  = require("moment");

module.exports = React.createClass({
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

        if (request.helper_assignment) {
            var helper = request.helper_assignment.helper.person;
            elems.push(
                <span className="request-assignment">
                    Assigned to {helper.first_name} {helper.last_name}
                </span>
            );
        } else {
            var availableHelpers = _.filter(this.props.helpers, function(h) {
                return !h.help_request;
            });
            elems.push(<button onClick={this.markLeft}>Student left</button>);
            elems.push(
                <form onSubmit={this.assignRequest}>
                    <input type="submit">Assign to...</input>
                    <select ref="helper">
                        {_.map(availableHelpers, this.renderHelperOption)}
                    </select>
                </form>
            );
        }

        return (
            <div class="help-request">
                {elems}
            </div>
        );
    }
});
