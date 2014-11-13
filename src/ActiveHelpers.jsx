var React   = require('react');
var _       = require('underscore');

module.exports = React.createClass({
    renderHelper: function(helper) {
        return (
            <li>
                <button className="active-helpers-sign-out">Sign out</button>
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
                        <form>
                            <input type="text" placeholder="SUNet ID" />
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
