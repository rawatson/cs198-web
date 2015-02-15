(function() {
    'use strict';

    var React       = require('react');
    var _           = require('underscore');
    var classNames  = require('classnames');

    var FormErrors  = require('../../shared/FormErrors.jsx');

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
            var sunetId = this.refs.sunetid.getDOMNode().value.toLowerCase();
            this.props.api.People.find(sunetId).then(function(student) {
                student = student.data;
                this.props.api.Courses.index({person_id: student.id, student: true}).then(function(courses) {
                    var errors = [];
                    courses = courses.data;

                    if (courses.length === 0) {
                        errors.push("It doesn't look like you're taking any courses we can help " +
                            "you with at the LaIR. Come back when you are!");
                    }

                    // invariant: recentRequests should be array of length 0 or 1
                    var recentRequests = _.filter(this.props.recentRequests, function(r) {
                        return (r.person.sunet_id == sunetId);
                    });
                    if (recentRequests.length > 0) {
                        errors.push("Sorry, but you need to wait at least 15 minutes since your " +
                            "previous request before you can ask for more help. Come back soon!");
                    }

                    if (!_.isEmpty(errors)) {
                        this.setState({errors: errors});
                        return;
                    }

                    if (student.help_requests && student.help_requests.length > 0) {
                        return this.props.submitCallback(student, student.help_requests[0]);
                    }

                    this.clearErrors();
                    this.setState({student: student, courses: courses});
                }.bind(this), function(err) {
                    var errors = ["An error happened when fetching your records. Please ask a " +
                        "section leader for help!"];
                    this.setState({errors: errors});
                });
            }.bind(this), function(error) {
                var errors = ["Oh no! We couldn't find you. Did you type your SUNet ID " +
                    "(not the number; i.e. YourID@stanford.edu) correctly?"];
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

            this.props.api.HelpRequests.create(data)
            .then(function(request) {
                request = request.data;
                return this.props.submitCallback(this.state.student, request);
            }.bind(this), function(err) {
                // TODO: handle error
                alert("We couldn't record your request. Please ask a section leader for assistance.");
                console.log(JSON.stringify(err));
            });
        },
        handleCancel: function(e) {
            this.setState({student: null, courses: null});
        },
        clearErrors: function() {
            this.setState({errors: []});
        },
        componentDidMount: function() {
            var clearErrors = this.clearErrors;
        },
        getInitialState: function() {
            return {errors: [], student: null, courses: null};
        },
        renderStudentUnchosen: function() {
            return [
                <p>Enter your SUNetID to request or view the status of your request.</p>,
                <div>
                    <input className="form-control signup-form-user" type="text" ref="sunetid"
                        placeholder="SUNet ID (i.e. YourID@stanford.edu)" onInput={this.clearErrors} />
                    <input className="btn btn-primary" type="submit" value="Request help" />
                </div>
            ];
        },
        renderCourseFormElem: function(student) {
            var course;
            if (this.state.courses.length > 1) {
                var options = _.map(this.state.courses, function(c) {
                    return (<option value={c.id}>{c.code}</option>);
                });
                return (
                    <select ref="course">{options}</select>
                );
            } else {
                var c = this.state.courses[0];
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
                    <button type="button" className="close-btn btn" onClick={this.handleCancel}>
                        Nevermind</button>
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
                                placeholder="Describe your problem... (in detail, please!)" />
                        </li>
                        <li>
                            <input className="form-control student-location" type="text" ref="location"
                                placeholder="Your location" />
                            <input className="btn btn-primary" type="submit" value="Request help" />
                        </li>
                        <li>
                        </li>
                    </ul>
                    <img src="/img/LairMap.png" />
                </div>
            );
        },
        render: function() {
            var errors, formElems;
            var className = classNames('row', 'signup-form', {
                'form-inline': this.state.student === null
            });

            if (this.state.errors.length > 0) {
                errors =
                    <div className="col-xs-12 col-sm-6 col-sm-offset-3 bg-danger pane">
                        <FormErrors errors={this.state.errors} />
                    </div>;
            }

            if (this.state.student === null) {
                formElems = this.renderStudentUnchosen();
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
}());
