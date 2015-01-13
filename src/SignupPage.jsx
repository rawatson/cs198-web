var React           = require('react');

var SignupForm      = require('./SignupForm.jsx');
var ActiveHelpers   = require('./ActiveHelpers.jsx');
var Api             = require('./Api');

module.exports = React.createClass({
    REFRESH_RATE: 10000, // milliseconds to refresh
    getInitialState: function() {
        return {student: null, queueStatus: {signups_enabled: null}};
    },
    refreshState: function() {
        //this.refreshActiveHelpers();
        this.refreshQueueStatus();
    },
    refreshActiveHelpers: function(data) {
        if (data) return this.setState({ helpers: data });

        Api.Helpers.index().then(function(data) {
            this.setState({ helpers: data.data });
        }.bind(this));
    },
    refreshQueueStatus: function(data) {
        if (data) return this.setState({ queueStatus: data });

        Api.LairState.find().then(function(data) {
            this.setState({queueStatus: data.data});
        }.bind(this));
    },
    resetForm: function() {
        if (typeof this.resetTimer !== 'undefined') {
            clearTimeout(this.resetTimer);
            this.resetTimer = undefined;
        }
        this.setState({student: null});
    },
    onHelpRequest: function(student, helpRequest) {
        this.setState({student: student, helpRequest: helpRequest});
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
    renderWelcomeState: function() {
        var elems;
        if (this.state.queueStatus.signups_enabled === true) {
            elems = [
                <SignupForm submitCallback={this.onHelpRequest} />
            ];
        } else if (this.state.queueStatus.signups_enabled === null) {
            elems = [
                <p>Loading...</p>
            ];
        } else {
            elems = [
                <p>Sorry, signups have been disabled now. Have a good day!</p>
            ];
        }
        return [
            <header className="row title">
                <div className="col-lg-12">
                    <h1>Welcome to the LaIR</h1>
                </div>
            </header>,
            <div className="row">
                <div className="col-lg-12">
                    {elems}
                </div>
            </div>
        ];
    },
    renderSubmittedState: function() {
        var elems = [];

        // reset the form after delay
        // TODO: make the timeout visible
        if (typeof this.resetTimer === 'undefined') {
            this.resetTimer = setTimeout(this.resetForm, this.FORM_RESET_TIMEOUT);
        }

        var message;
        if (this.state.helpRequest) {
            message = this.positionMessage(this.state.helpRequest.position);
            elems.push(<p>{message}</p>);
        }
        elems = elems.concat([
            <p>We will do our best to get to you as quickly as possible.</p>,
            <button className="btn" onClick={this.resetForm}>Return to request help</button>
        ]);

        return ([
            <header className="row title">
                <h1>{this.state.student.first_name}, we have your help request!</h1>
            </header>,
            <div className="row">
                {elems}
            </div>
        ]);
    },
    componentDidMount: function() {
        this.refreshInterval = setInterval(this.refreshState, this.REFRESH_RATE);
        this.refreshState();
    },
    componentWillUnmount: function() {
        clearInterval(this.refreshInterval);
    },
    render: function() {
        var content = [];
        if (this.state.student === null) {
            content.push(this.renderWelcomeState());
        } else {
            content.push(this.renderSubmittedState());
        }

        // TODO: re-enable when staff pics are ready
        //if (this.state.queueStatus.signups_enabled) {
            //content.push(<h2>Current LaIR helpers</h2>);
            //content.push(<ActiveHelpers helpers={this.state.helpers} staff={false} />);
        //}
        return (
            <div className="signup-page">
                {content}
            </div>
        );
    }
});
