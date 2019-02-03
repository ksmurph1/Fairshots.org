import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Footer, Navbar, DonutSpin } from "./components/UI";
import Main from "./components/main";

class App extends Component {
    render() {
        const { isAuthenticated, loading, history } = this.props;
        return (
            <div>
                <Navbar history={history} isAuthenticated={isAuthenticated} />
                <Main isAuthenticated={isAuthenticated} />
                <Footer />
                <DonutSpin spinshow={loading} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loading: state.loading,
    isAuthenticated: state.auth.isAuthenticated
});

export default hot(module)(withRouter(connect(mapStateToProps)(App)));
