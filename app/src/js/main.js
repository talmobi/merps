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
        console.log(ctx.state);

        self.setState({
          component: (
            <div>
              <Nav pathname={ctx.state.pathname}/>
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

  getInitialState: function () {
    return {
      active: 0,
      navItems: [{
        url: '/',
        text: 'Home'
      },{
        url: '/users/me',
        text: 'Me'
      },{
        url: '/users',
        text: 'Users'
      },{
        url: '/query?foo=bar&babar=fafar',
        text: 'Query'
      },{
        url: '/code',
        text: 'Code'
      },{
        url: '/' + Date.now(),
        text: '404'
      }]
    }
  },

  activate: function (index) {
    this.state.active = index;
    console.log("new index: " + index);
  },

  render: function () {
    var self = this;
    var components = this.state.navItems.map(function (item, index) {
      return <NavItem activate={self.activate} index={index}
        active={self.state.active === index} url={item.url} text={item.text} />
    });

    return (
      <nav className="navbar">
        <div className="container">
          <ul className="navbar-list">
            {components}
          </ul>
        </div>
      </nav>
    );
  }
});

var NavItem = React.createClass({
  handleClick: function () {
    this.props.activate(this.props.index);
    navigate(this.props.url)();
    console.log(this.props);
  },
  render: function () {
    return (
      <li>
        <a className={this.props.active ? 'active' : ''} onClick={this.handleClick}>{this.props.text}</a>
      </li>
    );
  }
});

var Home = React.createClass({
  render: function () {
    return (
      <div className="page">Home Page</div>
    );
  }
});

var Query = React.createClass({
  render: function () {
    return (
      <div className="page">Query Page, query: {this.props.querystring}</div>
    );
  }
});

var Users = React.createClass({
  render: function () {
    return (
      <div className="page">Users page. Params: {this.props.params.id}</div>
    );
  }
});

var Code = React.createClass({
  render: function () {
    return (
      <div className="page">Code page.
        <pre>
          <code>
            Code block Code block Code block Code block
          </code>
        </pre>
      </div>
    );
  }
});

var PageNotFound = React.createClass({
  render: function () {
    return (
      <div className="page">404: Page not found!</div>
    );
  }
});

/* Routes */

var routes = [
  ['/', Home],
  ['/users', Users],
  ['/users/:id', Users],
  ['/query', Query],
  ['/code', Code],
  ['*', PageNotFound],
];

/* Render */
React.renderComponent(<Router routes={routes} />, document.getElementById('main'));