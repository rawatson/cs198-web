var React   = require('react');
var _       = require('underscore');

module.exports = React.createClass({
    submitHandler: function(e) {
        e.preventDefault();
        this.props.callback(this.refs.helper.getDOMNode().value);
    },
    renderHelperOption: function(h) {
        // NOTE: gotcha! the below can't be
        //      {h.person.first_name} {h.person.last_name}
        // since that would produce two spans in an option tag, and option tags can't contain
        // anything but text. So do string interpolation instead, so that React just inserts
        // plain text. *FACEPALM*
        return <option value={h.id}>{h.person.first_name + " " + h.person.last_name}</option>;
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
