import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { login, logout } from "../../actions";
import LoginModal from "../../components/loginModal";
import {
    MDBNavItem,
    MDBNavLink,
    MDBIcon,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownItem,
    MDBDropdownMenu
} from "mdbreact";

import "./login-handler.scss";

class LoginHandler extends Component {
    state = {
        email: "",
        password: "",
        loginModal: false,
        profileNav: false
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = event => {
        event.preventDefault();
        const form = {
            email: this.state.email,
            password: this.state.password
        };

        this.props.doLogin(form);
        this.props.getProfile(
            this.props.userInfo.userType,
            this.props.userInfo.userId,
            this.props.userInfo.token
        );
    };

    toggleOpenCloses = name => {
        this.setState(prevState => ({ [name]: !prevState[name] }));
    };

    componentDidUpdate(prevProps) {
        if (this.props.isAuthenticated && !prevProps.isAuthenticated) {
            this.toggleOpenCloses("loginModal");
            this.setState({ email: "", password: "" });
            this.props.history.push(
                `/${this.props.userInfo.userType}/${this.props.userInfo.userId}`
            );
        }
    }

    render() {
        const {
            isAuthenticated,
            handleLogout,
            errorMessage,
            history,
            userInfo,
            profile
        } = this.props;

        return (
            <>
                {!isAuthenticated && (
                    <>
                        <MDBNavItem>
                            <MDBNavLink to="#!" onClick={() => this.toggleOpenCloses("loginModal")}>
                                <MDBIcon icon="user" className="mr-2" /> LOGIN
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                            <MDBNavLink to="/register#photographer">
                                <MDBIcon icon="user-plus" className="mr-2" /> SIGN UP
                            </MDBNavLink>
                        </MDBNavItem>
                    </>
                )}
                {isAuthenticated && (
                    <MDBDropdown>
                        <MDBDropdownToggle nav className="text-white">
                            <img
                                src={profile.Logo}
                                className="rounded-circle z-depth-0 mr-2"
                                alt=""
                            />
                            {userInfo.userName}
                        </MDBDropdownToggle>
                        <MDBDropdownMenu>
                            <MDBDropdownItem
                                onClick={() =>
                                    history.push(
                                        `/${this.props.userInfo.userType}/${
                                            this.props.userInfo.userId
                                        }`
                                    )
                                }
                            >
                                <MDBIcon className="mr-2" icon="cog" /> PROFILE
                            </MDBDropdownItem>
                            <MDBDropdownItem onClick={() => handleLogout(history)}>
                                <MDBIcon className="mr-2" icon="sign-in-alt" /> LOGOUT
                            </MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                )}
                <LoginModal
                    showModal={this.state.loginModal}
                    showLoginModal={this.toggleOpenCloses}
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    email={this.state.email}
                    password={this.state.password}
                    errorMessage={errorMessage}
                />
            </>
        );
    }
}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    errorMessage: state.auth.errorMessage,
    userInfo: state.auth.user,
    profile: state.profile
});

const mapDispatchToProps = dispatch => ({
    doLogin: formProps => {
        dispatch(login(formProps));
    },
    handleLogout: history => {
        history.push("/");
        dispatch(logout());
    },
    getUserProfile: (userType, id, token) => dispatch(getProfile(userType, id, token))
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(LoginHandler)
);
