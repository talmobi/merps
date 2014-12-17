/** @jsx React.dom */

var React = require('react');
var page = require('page');

var navigate = function (url) {
  return function () {
    page(url);
  }
};

/* Components */

var Router = React.createClass({
  getInitialState: function () {
    return {
      component: <div>Initial State</div>
    };
  },

  componentDidMount: function () {
    var self = this;

    this.props.routes.forEach(function (route) {
      var url = route[0];
      var Component = route[1];

      page(url, function (ctx) {
        self.setState({
          component: <Component params={ctx.params} querystring={ctx.querystring} />
        });
      });
    });

    page.start();
  },

  render: function () {
    return this.state.component;
  }

});

var Home = React.createClass({
  render: function () {
    return (
      <div>Home Page</div>
    );
  }
});

var Users = React.createClass({
  render: function () {
    return (
      <div>Users page. Params: {this.props.params.id}</div>
    );
  }
});

var PageNotFound = React.createClass({
  render: function () {
    return (
      <div>404: Page not found!</div>
    );
  }
});

/* Routes */

var routes = [
  ['/', Home],
  ['/users', Users],
  ['/users/:id', Users],
  ['*', PageNotFound],
];

/* Render */
React.renderComponent(<Router routes={routes} />, document.getElementById('main'));