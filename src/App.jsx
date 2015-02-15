(function() {
    'use strict';

    // React/routing dependencies
    var React           = require('react');
    var Router          = require('react-router');
    var Route           = Router.Route;
    var RouteHandler    = Router.RouteHandler;
    var NotFoundRoute   = Router.NotFoundRoute;
    var DefaultRoute    = Router.DefaultRoute;
    var Link            = Router.Link;

    // Components
    var HelperQueue     = require('./HelperQueue');
    var NotFound        = require('./NotFound.jsx');

    var apiUrl          = "http://prod-env-tfquxfu9vd.elasticbeanstalk.com";
    var api             = require('./Api')(apiUrl);

    var App = React.createClass({
        // TODO: don't expose links to go between each view; password protect
        render: function() {
            return (
                <div className="container-fluid">
                    <RouteHandler />
                </div>
            );
        }
    });

    var routes = (
        <Route name="app" path="/" handler={App}>
            <Route name="queue" handler={HelperQueue.HelperView(api)} />
            <Route name="signup" handler={HelperQueue.SignupView(api)} />
            <DefaultRoute handler={NotFound} />
            <NotFoundRoute handler={NotFound} />
        </Route>
    );

    Router.run(routes, Router.HistoryLocation, function(Handler) {
      React.render(<Handler />, document.body);
    });
}());
