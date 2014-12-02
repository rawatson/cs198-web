var React   = require('react');
var Api     = require('./Api');
var _       = require('underscore');

module.exports = React.createClass({
    handleSignIn: function(e) {
        e.preventDefault();

        person_id = this.refs.sunet_id.getDOMNode().value;
        Api.Helpers.checkin(person_id).then(function(helper) {
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
            // TODO: real error handling
            alert(JSON.stringify(err));
        });
    },
    handleSignOut: function(helper_id, e) {
        Api.Helpers.checkout(helper_id).then(function() {
            this.props.refresh(_.reject(this.props.helpers, function(h) {
                return h.id == helper_id;
            }));
        }.bind(this), function(err) {
            // TODO: real error handling
            alert(JSON.stringify(err));
        });
    },
    renderHelper: function(helper) {
        var elems = [];
        if (this.props.staff) {
            elems.push(
                <a href="#" className="helper-sign-out list-btn"
                    onClick={this.handleSignOut.bind(this, helper.id)}>
                    <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </a>);
        }
        elems.push(
            <span className="active-helpers-name">
                {helper.person.first_name + " " + helper.person.last_name}
            </span>
        );
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
                    <input type="text" ref="sunet_id" placeholder="SUNet ID" />
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
