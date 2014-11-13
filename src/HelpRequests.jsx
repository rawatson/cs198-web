var React   = require('react');
var _       = require('underscore');

module.exports = React.createClass({
    renderRequest: function(request) {
        return (
            <li>
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
            </li>
        );
    },
    render: function() {
        var helpRequestsElem;
        if (this.props.requests === null) {
            helpRequestsElem = (<span>Loading...</span>);
        } else {
            helpRequestsElem = (
               <ul>{_.map(this.props.requests.unassigned,
                          this.renderRequest)}</ul>
            );
        }

        return (
            <div className="help-requests">
                <h3>Help Requests</h3>
                {helpRequestsElem}
            </div>
        );
    }
});
