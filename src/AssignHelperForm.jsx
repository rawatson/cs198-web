var React   = require('react');
var _       = require('underscore');

module.exports = React.createClass({
    submitHandler: function(e) {
        e.preventDefault();
        this.props.callback(this.refs.helper.getDOMNode().value);
    },
    renderHelperOption: function(h) {
        return <option value={h.id}>{h.person.first_name} {h.person.last_name}</option>;
    },
    render: function() {
        var formContents;
        if (_.isEmpty(this.props.availableHelpers)) {
            formContents = <span>Cannot {this.props.verb}; all helpers busy.</span>;
        } else {
            formContents = (
                <div>
                    <input type="submit" value={this.props.prompt} />
                    <select ref="helper">
                        {_.map(this.props.availableHelpers, this.renderHelperOption)}
                    </select>
                </div>);
        }

        return (
            <form className="assign-form" onSubmit={this.submitHandler}>
                {formContents}
            </form>
        );
    }
});
