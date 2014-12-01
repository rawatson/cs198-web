// React/routing dependencies
var React =             require('react');
require('es6-promise').polyfill();

var Router =            require('react-router');
var Route =             Router.Route;
var Routes =            Router.Routes;
var NotFoundRoute =     Router.NotFoundRoute;
var DefaultRoute =      Router.DefaultRoute;
var Link =              Router.Link;

// Components
var HelperQueue =   require('./HelperQueue.jsx');
var SignupBox =        require('./SignupBox.jsx');
var NotFound =      require('./NotFound.jsx');

var App = React.createClass({
    // TODO: don't expose links to go between each view; password protect
    render: function() {
        return (
            <div>
                <ul>
                    <li><Link to="queue">Queue</Link></li>
                    <li><Link to="signup">Sign Up</Link></li>
                </ul>
                <this.props.activeRouteHandler />
            </div>
        );
    }
});

var routes = (
    <Routes location="history">
        <Route name="app" path="/" handler={App}>
            <Route name="queue" handler={HelperQueue} />
            <Route name="signup" handler={SignupBox} />
            <DefaultRoute handler={NotFound} />
        </Route>
        <NotFoundRoute handler={NotFound} />
    </Routes>
);

React.renderComponent(routes, document.body);
