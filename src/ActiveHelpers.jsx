var React   = require('react');
var Api     = require('./Api');
var _       = require('underscore');

module.exports = React.createClass({
    handleSignIn: function(e) {
        e.preventDefault();

        data = {
            person_id: this.refs.sunet_id.getDOMNode().value
        };
        Api.Helpers.checkin(data).then(function(helper) {
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
        data = {
            person_id: helper_id
        };

        Api.Helpers.checkout(data).then(function() {
            this.props.refresh(_.reject(this.props.helpers, function(h) {
                return h.id == helper_id;
            }));
        }.bind(this), function(err) {
            // TODO: real error handling
            alert(JSON.stringify(err));
        });
    },
    renderHelper: function(helper) {
        return (
            <li>
                <button className="active-helpers-sign-out"
                        onClick={this.handleSignOut.bind(this, helper.id)}>Sign out</button>
                <span className="active-helpers-name">{helper.first_name} {helper.last_name}</span>
            </li>
        );
    },
    render: function() {
        var helpersElem;

        if (this.props.helpers === null) {
            helpersElem = (<span>Loading...</span>);
        } else {
            helpersElem = (
                <ul>
                    {_.map(this.props.helpers, this.renderHelper)}
                    <li>
                        <form onSubmit={this.handleSignIn}>
                            <input type="text" ref="sunet_id" placeholder="SUNet ID" />
                            <input type="submit" value="Sign in" />
                        </form>
                    </li>
                </ul>
            );
        }

        return (
            <div className="active-helpers">
                <h3>Active Helpers</h3>
                {helpersElem}
            </div>
        );
    }
});
