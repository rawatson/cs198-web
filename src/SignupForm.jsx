var React       = require('react');
var _           = require('underscore');

var Api         = require('./Api.js');
var FormErrors  = require('./FormErrors.jsx');

module.exports = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        if (this.state.student === null) {
            this.handleStudentSearch();
        } else {
            this.handleRequestSubmission();
        }
    },
    handleStudentSearch: function() {
        var sunetId = this.refs.sunetid.getDOMNode().value;
        Api.People.find(sunetId).then(function(student) {
            student = student.data;
            console.log(student);
            if (student.courses_taking.length === 0) {
                var errors = ["It doesn't look like you're taking any courses we can help " +
                    "you with at the LaIR. Come back when you are!"];
                this.setState({errors: errors});
                return;
            }

            if (student.help_requests && student.help_requests.length > 0) {
                return this.props.submitCallback(student, student.help_requests[0]);
            }

            this.clearErrors();
            this.setState({student: student});
        }.bind(this), function(error) {
            var errors = ["Oh no! We couldn't find you. Did you type your SUNet ID correctly?"];
            this.setState({errors: errors});
        }.bind(this));
    },
    handleRequestSubmission: function() {
        var course_id;
        var data = {
            description: this.refs.description.getDOMNode().value,
            location: this.refs.location.getDOMNode().value,
            person_id: this.state.student.id,
            course_id: this.refs.course.getDOMNode().value
        };

        Api.HelpRequests.create(data)
        .then(function(request) {
            request = request.data;
            return this.props.submitCallback(this.state.student, request);
        }.bind(this), function(error) {
            // TODO: handle error
            alert(error);
        });
    },
    handleCancel: function(e) {
        this.setState({student: null});
    },
    clearErrors: function() {
        this.setState({errors: []});
    },
    componentDidMount: function() {
        var clearErrors = this.clearErrors;
    },
    getInitialState: function() {
        return {errors: [], student: null};
    },
    renderStudentUnchosen: function() {
        return [
            <p>Enter your SUnetID to request or view the status of your request.</p>,
            <input className="form-control signup-form-user" type="text" ref="sunetid"
                placeholder="SUNet ID" onInput={this.clearErrors} />,
            <input className="btn btn-primary" type="submit" value="Request help" />
        ];
    },
    renderCourseFormElem: function(student) {
        var course;
        if (this.state.student.courses_taking.length > 1) {
            var options = _.map(this.state.student.courses_taking, function(c) {
                return (<option value={c.id}>{c.code}</option>);
            });
            return (
                <select ref="course">{options}</select>
            );
        } else {
            var c = this.state.student.courses_taking[0];
            return (
                <span className="course-final">
                    {c.code}
                    <input type="hidden" ref="course" value={c.id} />
                </span>
            );
        }
    },
    renderStudentChosen: function() {
        var course = this.renderCourseFormElem();

        return (
            <div className="signup-form-contents">
                <button className="close-btn btn" onClick={this.handleCancel}>Nevermind</button>
                <ul>
                    <li>
                        <span className="inline-label">SUNet ID:</span>
                        <span className="user-final">
                            {this.state.student.sunet_id}
                        </span>
                    </li>
                    <li>
                        <span className="inline-label">Course:</span>
                        {course}
                    </li>
                    <li>
                        <textarea className="form-control" rows="3" ref="description"
                            placeholder="Describe your problem..." />
                    </li>
                    <li>
                        <input className="form-control student-location" type="text" ref="location"
                            placeholder="Your location" />
                        <input className="btn btn-primary" type="submit" value="Request help" />
                    </li>
                    <li>
                    </li>
                </ul>
            </div>
        );
    },
    render: function() {
        var errors, formElems;
        var className = "row signup-form";

        if (this.state.errors.length > 0) {
            errors =
                <div className="col-md-4 col-md-offset-4 bg-danger pane">
                    <FormErrors errors={this.state.errors} />
                </div>;
        }

        if (this.state.student === null) {
            formElems = this.renderStudentUnchosen();
            className += " form-inline";
        } else {
            formElems = this.renderStudentChosen();
        }

        return (
            <form className={className} onSubmit={this.handleSubmit}>
                <div className="col-sm-6 col-sm-offset-3 pane">{formElems}</div>
                {errors}
            </form>
        );

    }
});
