(function() {
    'use strict';

    var React   = require('react');
    var _       = require('underscore');

    module.exports = React.createClass({
        handleSignIn: function(e) {
            e.preventDefault();

            var formItem = this.refs.sunet_id.getDOMNode();
            var personId = formItem.value;

            this.props.api.Helpers.checkin(personId).then(function(helper) {
                formItem.value = "";
                helper = helper.data;
                var helpers = this.props.helpers;

                // Don't add immediately; checkin is idempotent, so it succeeds if the helper is
                // already checked in.
                var notPresent = (_.find(helpers, function(h) {
                    return h.id == helper.id;
                }) === undefined);
                if (notPresent) {
                    helpers = _.clone(this.props.helpers);
                    helpers.push(helper);
                }

                this.props.refresh(helpers);
            }.bind(this), function(err) {
                //TODO: handle more elegantly
                if (err.readyState == 4 && err.status >= 400 && err.status < 500) {
                    if (err.responseJSON.data.message == "Person not found") {
                         // TODO: display nicely
                        alert("Could not find a person with that user ID; check your input");
                        return;
                    }
                }

                alert("Check-in failed; please refresh and try again.");
                console.log(err);
            });
        },
        handleSignOut: function(helper_id, e) {
            this.props.api.Helpers.checkout(helper_id).then(function() {
                this.props.refresh(_.reject(this.props.helpers, function(h) {
                    return h.id == helper_id;
                }));
            }.bind(this), function(err) {
                //TODO: handle more elegantly
                alert("Check-out failed; please refresh and try again.");
                console.log(err);
            });
        },
        renderHelper: function(helper) {
            var elems = [];

            if (this.props.staff) {
                var className = "helper-sign-out list-btn";
                var handler;
                if (helper.help_request) {
                    className += " invisible";
                    handler = function(e) { e.preventDefault(); };
                } else {
                    handler = this.handleSignOut.bind(this, helper.id);
                }
                elems.push(
                    <a href="#" className={className} onClick={handler}>
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    </a>);
            }
            elems.push(
                <span className="active-helper-name">
                    {helper.person.first_name + " " + helper.person.last_name}
                </span>
            );

            if (this.props.staff && helper.help_request) {
                elems.push(<span className="active-helper-status">Busy</span>);
            }
            return <li>{elems}</li>;
        },
        render: function() {
            var elems = [];

            if (this.props.helpers === null) {
                elems.push(<span>Loading...</span>);
            } else {
                elems.push(
                    <ul className="helper-list">
                        {_.map(this.props.helpers, this.renderHelper)}
                    </ul>
                );
            }

            if (this.props.staff) {
                elems.push(
                    <form className="helper-sign-in" onSubmit={this.handleSignIn}>
                        <input type="text" className="form-control" ref="sunet_id"
                            placeholder="SUNet ID" />
                        <input className="btn btn-primary" type="submit" value="Sign in" />
                    </form>
                );
            }

            return (
                <div className="active-helpers content-pane">
                    {elems}
                </div>
            );
        }
    });
}());
