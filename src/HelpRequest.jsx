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
        var helper;

        var assignElems = [];
        if (request.helper) {
            helper = request.helper.person;
            var resolveRequestHandler = function(reason, e) {
                e.preventDefault();
                this.resolveRequest("resolved");
            };

            assignElems.push(
                <button className="btn btn-default"
                    onClick={resolveRequestHandler.bind(this, "left")}>Student left</button>);
            assignElems.push(
                <button className="btn btn-primary"
                    onClick={resolveRequestHandler.bind(this, "resolved")}>Resolved</button>);
            assignElems.push(<AssignHelperForm
                availableHelpers={this.availableHelpers()}
                callback={this.reassignRequest}
                prompt="Reassign to..." verb="reassign" />);
        } else {
            var prompt;
            var verb;
            if (this.props.request.open) {
                prompt = "Assign to...";
                verb = "assign";
            } else {
                prompt = "Reopen and assign to...";
                verb = "reopen";
            }
            assignElems.push(<AssignHelperForm
                availableHelpers={this.availableHelpers()}
                callback={this.assignRequest}
                prompt={prompt} verb={verb} />);
        }

        var elems = [
            <div className="row">
                <div className="row-items col-lg-4 col-md-2">
                    <span className="request-student">
                        {request.person.first_name + " " + request.person.last_name}
                    </span>
                    <span className="request-course">
                        {request.course.code}
                    </span>
                </div>
                <div className="row-items assign-btns col-md-10 col-lg-8">
                    {assignElems}
                </div>
            </div>
        ];

        if (helper) {
            elems.push(<div><span className="request-assignment">
                {"Assigned to " + helper.first_name + " " + helper.last_name}
            </span></div>);
        }
        elems = elems.concat([
            <div className="request-description">
                {request.description}
            </div>,
            <div>
                <span className="request-location">
                    {"Location: " + request.location}
                </span>
                <span className="request-timestamp">
                    {moment(request.created_at).format("h:mm A MMM D, YYYY")}
                </span>
            </div>
        ]);

        var className = "clearfix help-request";
        if (this.props.highlight) {
            className += " bg-success";
        }
        return (
            <div className={className}>
                {elems}
            </div>
        );
    }
});
