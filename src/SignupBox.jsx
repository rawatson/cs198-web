var React = require('react');
var SignupForm = require('./SignupForm.jsx');
var ActiveHelpers = require('./ActiveHelpers.jsx');

module.exports = React.createClass({
    getInitialState: function() {
        return {student: null};
    },
    resetForm: function() {
        this.setState({student: null});
    },
    onHelpRequest: function(student, queueStats) {
        this.setState({student: student, queueStats: queueStats});
    },
    positionMessage: function(pos) {
        switch (pos) {
        case 0:
            return "You are next to receive help!";
        case 1:
            return "There is one person ahead of you.";
        default:
            return "There are " + pos + " people ahead of you.";
        }
    },
    FORM_RESET_TIMEOUT: 10000,
    render: function() {
        var content;
        if (this.state.student === null) {
            content = (
                <div>
                    <h1>Welcome to the LaIR</h1>
                    <p>Enter your SUnetID to request or view the status of your request.</p>
                    <SignupForm submitCallback={this.onHelpRequest} />
                </div>
            );
        } else {
            // reset the form after delay
            // TODO: make the timeout visible
            var timer = setTimeout(this.resetForm, this.FORM_RESET_TIMEOUT);

            // Click handler needs to cancel the resetForm event
            var clickHandler = function(timer) {
                return function() {
                    clearTimeout(timer);
                    this.resetForm();
                }.bind(this);
            }.bind(this)(timer);

            content = (
                <div>
                    <h1>{this.state.student.first_name}, we have your help request!</h1>
                    <p>{this.positionMessage(this.state.queueStats.position)}</p>
                    <p>We will do our best to get to you as quickly as possible.</p>
                    <button onClick={clickHandler}>Return to request help</button>
                </div>
            );
        }
        return (
            <div className="signup-box">
                {content}
                <h2>Current LaIR helpers</h2>
                <ActiveHelpers helpers={this.state.helpers} staff={false} />
            </div>
        );
    }
});
