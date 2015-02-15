var React = require('react');
var _ = require('underscore');

module.exports = React.createClass({
    render: function() {
        var errors = _.map(this.props.errors, function(e) {
            return (<li>{e}</li>);
        });

        return (
            <ul className="form-errors">{errors}</ul>
        );
    }
});
