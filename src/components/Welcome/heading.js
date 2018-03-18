import React, { Component, Fragment } from "react"
import RaisedButton from "material-ui/RaisedButton"
import { TopBarSecurityMessage } from "../../env.js"
import Modal from "../Modal"
import "./Heading.css"


export default class Heading extends Component {
    componentWillMount = () => this.hideSignupModal()

    showSignupModal = () => this.props.changeModalState({
        modals: {
            signup: {
                showing: true,
            },
        },
    })

    hideSignupModal = () => this.props.changeModalState({
        modals: {
            signup: {
                showing: false,
            },
        },
    })

    render = () => <Fragment>
        <Modal
            open={this.props.appUi.modals.signup.showing}
            title="Opening Your Bank"
            actions={
                <RaisedButton
                    backgroundColor="rgb(15,46,83)"
                    labelStyle={{ color: "rgb(244,176,4)", }}
                    label="Cancel"
                    keyboardFocused={false}
                    onClick={this.hideSignupModal}
                />
            }/>
        <TopBarSecurityMessage />
        <div className="faded-image cash">
            <div className="hero">
                <div className="title">
                    Welcome to the money revolution.
                </div>
                <div className="subtitle">
                    Open your own <b>lifetime bank</b> today and
                    reserve personalized payment address.
                </div>
            </div>

            <div className="flex-row-centered">
                <RaisedButton
                    onClick={this.showSignupModal}
                    backgroundColor="rgb(244,176,4)"
                    label="Get Started"
                />
            </div>
            <div className="container">
                <div className="columns">
                    <div className="column">
                        <div className="col-header">True Freedom</div>
                        <div className="col-item">
                            <i className="material-icons">alarm_on</i>
                            Transaction settlement in seconds.
                        </div>
                        <div className="col-item">
                            <i className="material-icons">
                                location_off
                            </i>
                            Location independent.
                        </div>
                        <div className="col-item">
                            <i className="material-icons">language</i>
                            Global, permissionless transacting.
                        </div>
                    </div>
                    <div className="column">
                        <div className="col-header">
                            Easy, Secure Transactions
                        </div>
                        <div className="col-item">
                            <i className="material-icons">
                                fingerprint
                            </i>
                            Security by design.
                        </div>
                        <div className="col-item">
                            <i className="material-icons">
                                perm_contact_calendar
                            </i>
                            Pay to address book contacts.
                        </div>
                        <div className="col-item">
                            <i className="material-icons">email</i>
                            Use email as payment address.
                        </div>
                    </div>
                    <div className="column">
                        <div className="col-header">
                            Fractional Cost
                        </div>
                        <div className="col-item">
                            <i className="material-icons">
                                account_balance
                            </i>
                            Account activation fee 0.50$.
                        </div>
                        <div className="col-item">
                            <i className="material-icons">
                                settings_ethernet
                            </i>
                            End-to-end transfer fee 0.99$.
                        </div>
                        <div className="col-item">
                            <i className="material-icons">replay</i>
                            Free recurring payments.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fragment>
}
