var React   = require('react');
var _       = require('underscore');

module.exports = React.createClass({
    renderHelperOption: function(h) {
        var handler = function(value) {
            return function(e) {
                e.preventDefault();
                this.props.callback(value);
            }.bind(this);
        }.bind(this);
        return (
            <li><a href="#" onClick={handler(h.id)}>
                {h.person.first_name + " " + h.person.last_name}
            </a></li>);
    },
    render: function() {
        var formContents;
        if (_.isEmpty(this.props.availableHelpers)) {
            formContents = <span className="assign-message">
                {"Can't " + this.props.verb + "; no free helpers"}</span>;
        } else {
            formContents = (
                <div className="btn-group">
                    <button type="button" className="btn btn-default dropdown-toggle"
                        data-toggle="dropdown" aria-expanded="false">
                        {this.props.prompt}
                    </button>
                    <ul className="dropdown-menu" role="menu">
                        {_.map(this.props.availableHelpers, this.renderHelperOption)}
                    </ul>
                </div>);
        }

        return (
            <div className="assign-helper">
                {formContents}
            </div>
        );
    }
});
