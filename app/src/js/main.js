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
          component: (
            <div>
              <Nav />
              <Component params={ctx.params} querystring={ctx.querystring} />
            </div>
          )
        });
      });
    });

    page.start();
  },

  render: function () {
    return this.state.component;
  }

});

var Nav = React.createClass({
  render: function () {
    return (
      <nav>
        <ul>
          <li><a onClick={navigate('/')}>Home</a></li>
          <li><a onClick={navigate('/users/me')}>Me</a></li>
          <li><a onClick={navigate('/users')}>Users</a></li>
          <li><a onClick={navigate('/error')}>Error</a></li>
        </ul>
      </nav>
    );
  }
});

var Home = React.createClass({
  render: function () {
    return (
      <div>Home PagePage</div>
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