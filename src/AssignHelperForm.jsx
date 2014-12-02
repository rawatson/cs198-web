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
    enableTooltip: function() {
        if (this.refs.assignButton) {
            $(this.refs.assignButton.getDOMNode()).tooltip();
        }
    },
    componentDidMount: function() {
        this.enableTooltip();
    },
    componentDidUpdate: function() {
        this.enableTooltip();
    },
    render: function() {
        var assignButton;
        if (_.isEmpty(this.props.availableHelpers)) {
            assignButton = (
                <div ref="assignButton" aria-expanded="false" data-toggle="tooltip"
                    data-placement="top" className="tooltip-wrapper"
                    title={"Can't " + this.props.verb + "; all helpers busy!"}>
                    <button type="button" className="btn btn-default" disabled="true">
                        {this.props.prompt}
                    </button>
                </div>);
        } else {
            assignButton = (
                <button type="button" className="btn btn-default dropdown-toggle"
                    ref="assignButton" data-toggle="dropdown" aria-expanded="false">
                    {this.props.prompt}
                </button>);
        }

        return (
            <div className="assign-helper">
                <div className="btn-group">
                    {assignButton}
                    <ul className="dropdown-menu" role="menu">
                        {_.map(this.props.availableHelpers, this.renderHelperOption)}
                    </ul>
                </div>
            </div>
        );
    }
});
