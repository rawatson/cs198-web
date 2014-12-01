var React   = require('react');
var _       = require('underscore');
var moment  = require("moment");

module.exports = React.createClass({
    render: function() {
        var request = this.props.request;
        return (
            <div class="help-request">
                <span className="request-student">
                    {request.person.first_name} {request.person.last_name}
                </span>
                <span className="request-description">
                    {request.description}
                </span>
                <span className="request-course">
                    {request.course.code}
                </span>
                <span className="location">
                    {request.location}
                </span>
                <span className="timestamp">
                    {moment(request.created_at).format("h:mm A MMM D, YYYY")}
                </span>
            </div>
        );
    }
});
