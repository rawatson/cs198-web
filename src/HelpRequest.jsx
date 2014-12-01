var React   = require('react');
var _       = require('underscore');
var moment  = require("moment");

module.exports = React.createClass({
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
        }

        return (
            <div class="help-request">
                {elems}
            </div>
        );
    }
});
