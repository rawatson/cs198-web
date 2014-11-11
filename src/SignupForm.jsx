var React = require('react');
var _ = require('underscore');
var $ = require('jquery');
var FormErrors = require('./FormErrors.jsx');

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
        var student = this.searchUser();
        var errors = this.validateStudent(student);
        if (errors.length > 0) {
            this.setState({errors: errors});
            return false;
        }

        if (student.requests.length > 0) {
            var submitCallback = this.props.submitCallback;
            var queueStats = this.getQueueStats(student.requests[0].id, function(queueStats) {
                submitCallback(student, queueStats);
            });
        }

        this.clearErrors();
        this.setState({student: student});
    },
    submitHelpRequest: function(data, cb) {
        // TODO: ajax call to actually do this
        cb({request_id: 7});
    },
    getQueueStats: function(requestId, cb) {
        // TODO: ajax call to actually do this
        if (requestId === 5) {
            cb({position: 2});
        } else {
            cb({position: 4});
        }
    },
    handleRequestSubmission: function() {
        var course_id;
        var formData = {
            description: this.refs.description.getDOMNode().value,
            location: this.refs.location.getDOMNode().value,
            person_id: this.state.student.id,
            course_id: this.refs.course.getDOMNode().value
        };

        var student = this.state.student;
        var submitCallback = this.props.submitCallback;
        var getQueueStats = this.getQueueStats;
        this.submitHelpRequest(formData, function(request_id) {
            getQueueStats(request_id, function(queueStats) {
                submitCallback(student, queueStats);
            });
        });
    },
    handleCancel: function(e) {
        this.setState({student: null});
    },
    clearErrors: function() {
        this.setState({errors: []});
    },
    validateStudent: function(student) {
        var errors = [];
        if (!student) {
            errors = ["Oh no! We couldn't find you. Did you type your SUNet ID correctly?"];
        } else if (student.courses.length === 0) {
            errors = ["It doesn't look like you're taking any courses we can help " +
                "you with at the LaIR. Come back when you are!"];
            this.setState({errors: errors});
        }

        return errors;
    },
    componentDidMount: function() {
        var clearErrors = this.clearErrors;
        $(".signup-form-user").bind("input", function() {
            clearErrors();
        });
    },
    searchUser: function() {
        var sunetId = this.refs.sunetid.getDOMNode().value;

        // TODO: actually search by suid for people, outstanding requests, enrollments
        if (sunetId === "odiab") {
            return { sunet_id: "odiab",
                first_name: "Omar",
                courses: [{id: 0, name: "CS106A"}],
                requests: [] };
        } else if (sunetId === "rawatson") {
            return { sunet_id: "rawatson",
                first_name: "Reid",
                courses: [{id: 0, name: "CS106A"}, {id: 1, name: "CS106B"}],
                requests: []
            };
        } else if (sunetId === "kmiller4") {
            return { sunet_id: "kmiller4",
                first_name: "Kevin",
                courses: [{id: 0, name: "CS106A"}],
                requests: [{
                    id: 5,
                    course_id: 0,
                    description: "I don't know thing",
                    location: "bathroom"
                }] };
        } else if (sunetId === "amainero") {
            return { sunet_id: "amainero",
                first_name: "Anthony",
                courses: [],
                requests: [] };
        } else {
            return false;
        }
    },
    getInitialState: function() {
        return {errors: [], student: null};
    },
    render: function() {
        var errors;
        if (this.state.errors.length > 0) {
            errors = (<FormErrors errors={this.state.errors} />);
        }

        var formElems;
        if (this.state.student === null) {
            formElems = (
                <ul><li>
                    <input className="signup-form-user" type="text" ref="sunetid"
                        placeholder="SUNet ID" />
                </li></ul>
            );
        } else {
            var course;
            if (this.state.student.courses.length > 1) {
                var options = _.map(this.state.student.courses, function(c) {
                    return (<option value={c.id}>{c.name}</option>);
                });
                course = (
                    <label>
                        Course:
                        <select ref="course">{options}</select>
                    </label>
                );
            } else {
                var c = this.state.student.courses[0];
                course = (
                    <span>
                        {c.name}
                        <input type="hidden" ref="course" value={c.id} />
                    </span>
                );
            }

            formElems = (
                <div className="signup-form-contents">
                    <button onClick={this.handleCancel}>Nevermind</button>
                    <ul>
                        <li>
                            <span className="signup-form-user-final">
                                {this.state.student.sunet_id}
                            </span>
                        </li>
                        <li>{course}</li>
                        <li>
                            <textarea rows="3" ref="description"
                                placeholder="Describe your problem..." />
                        </li>
                        <li>
                            <input type="text" ref="location"
                                placeholder="Your location" />
                        </li>
                        <li><input type="submit" value="Request help" /></li>
                    </ul>
                </div>
            );
        }

        return (
            <form className="signup-form" onSubmit={this.handleSubmit}>
                {errors}
                {formElems}
            </form>
        );

    }
});
