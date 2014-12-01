var React   = require('react');
var _       = require('underscore');
var moment  = require("moment");

var Api = require("./Api");
var AssignHelperForm = require("./AssignHelperForm.jsx");

module.exports = React.createClass({
    resolveRequest: function(reason) {
        Api.HelpRequests.resolve(this.props.request.id, reason).then(function() {
            this.props.refresh();
        }.bind(this), function(err) {
            // TODO: handle error
            alert(err);
        });
    },
    reassignRequest: function(helper_id) {
        if (typeof helper_id === "string") helper_id = parseInt(helper_id);

        Api.HelpRequests.reassign(this.props.request.id, helper_id).then(function() {
            this.props.refresh();
        }.bind(this), function(err) {
            // TODO: handle error
            alert(err);
        });

    },
    assignRequest: function(helper_id) {
        if (typeof helper_id === "string") helper_id = parseInt(helper_id);

        Api.HelpRequests.assign(this.props.request.id, helper_id).then(function() {
            this.props.refresh();
        }.bind(this), function(err) {
            // TODO: handle error
            alert(err);
        });

    },
    availableHelpers: function() {
        return _.filter(this.props.helpers, function(h) {
            return !h.help_request;
        });
    },
    render: function() {
        var request = this.props.request;

        var elems = [
            <div className="request-info">
                <span className="request-student">
                    {request.person.first_name} {request.person.last_name}
                </span>
                <span className="request-description">
                    {request.description}
                </span>
                <span className="request-course">
                    {request.course.code}
                </span>
                <span className="request-location">
                    {request.location}
                </span>
                <span className="request-timestamp">
                    {moment(request.created_at).format("h:mm A MMM D, YYYY")}
                </span>
            </div>
        ];

        if (request.helper) {
            var helper = request.helper.person;
            var resolveRequestHandler = function(reason, e) {
                e.preventDefault();
                this.resolveRequest("resolved");
            };

            elems.push(
                <span className="request-assignment">
                    Assigned to {helper.first_name} {helper.last_name}
                </span>);
            elems.push(
                <button onClick={resolveRequestHandler.bind(this, "left")}>Student left</button>);
            elems.push(
                <button onClick={resolveRequestHandler.bind(this, "resolved")}>Resolved</button>);
            elems.push(<AssignHelperForm
                availableHelpers={this.availableHelpers()}
                callback={this.reassignRequest}
                prompt="Reassign to..." verb="reassign" />);
        } else {
            var prompt;
            var verb;
            if (this.props.request.close_status) {
                prompt = "Reopen and assign to...";
                verb = "reopen";
            } else {
                prompt = "Assign to...";
                verb = "assign";
            }
            elems.push(<AssignHelperForm
                availableHelpers={this.availableHelpers()}
                callback={this.assignRequest}
                prompt={prompt} verb={verb} />);
        }

        return (
            <div class="help-request">
                {elems}
            </div>
        );
    }
});
