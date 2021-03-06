import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { Server } from "stellar-sdk"
import { Redirect, Route } from "react-router-dom"
import {
    ConnectedSwitch as Switch, ensureTrailingSlash, resolvePath,
    withDynamicRoutes, withStaticRouter,
} from "../StellarRouter"
import { rgba } from "../../lib/utils"
import { firebaseApp } from "../StellarFox"
import { action as PaymentsAction } from "../../redux/Payments"
import { action as StellarAccountAction } from "../../redux/StellarAccount"
import { Tab, Tabs } from "material-ui/Tabs"
import PaymentsTable from "../PaymentsTable"
import Transactions from "./Transactions"
import { Typography } from "@material-ui/core"
import "./index.css"





// ...
const styles = {
    tab: {
        backgroundColor: "#2e5077",
        borderRadius: "3px",
        color: rgba(244, 176, 4, 0.9),
    },
    inkBar: {
        backgroundColor: rgba(244, 176, 4, 0.8),
    },
    container: {
        backgroundColor: "#2e5077",
        borderRadius: "3px",
    },
}




// <Payments> component
class Payments extends Component {

    // ...
    static propTypes = {
        match: PropTypes.object.isRequired,
        staticRouter: PropTypes.object.isRequired,
    }


    // ...
    constructor (props) {
        super(props)

        // relative resolve
        this.rr = resolvePath(this.props.match.path)

        // ...
        this.validTabNames = ["History", "Transactions" ]

        // static paths
        this.props.staticRouter.addPaths(
            this.validTabNames.reduce((acc, tn) => ({
                ...acc,
                [tn]: this.rr(ensureTrailingSlash(tn.toLowerCase())),
            }), {})
        )

        // ...
        this.stellarServer = new Server(this.props.horizon)
    }


    // ...
    getTransactions = () => {
        if (
            (this.props.state.txCursorLeft === null  &&
            this.props.state.txCursorRight === null)  ||
            !this.props.transactions
        ) {
            return this.stellarServer
                .transactions()
                .forAccount(this.props.publicKey)
                .order("desc")
                .limit(5)
                .call()
                .then((transactionsResult) => {
                    this.props.setTransactions(transactionsResult.records)
                    this.updateTransactionsCursors(transactionsResult.records)
                })
                .catch(function (err) {
                    // eslint-disable-next-line no-console
                    console.log(err)
                })
        }
        return Promise.resolve()
    }


    // ...
    handleTabSelect = (value) => {
        this.props.setState({ tabSelected: value })
        this.props.staticRouter.pushByView(value)
        if (
            value === "Transactions"  &&
            firebaseApp.auth("session").currentUser &&
            this.props.userId && this.props.token
        ) {
            this.getTransactions()
        }
    }


    // ...
    updateTransactionsCursors = (records) =>
        this.props.setState({
            txCursorLeft: records[0].paging_token,
            txCursorRight: records[records.length - 1].paging_token,
        })


    // ...
    render = () => (
        ({ currentView, staticRouter: { getPath }, state }) =>
            <Switch>
                <Redirect exact
                    from={this.rr(".")}
                    to={getPath(state.tabSelected)}
                />
                <Route
                    exact
                    path={
                        this.validTabNames.indexOf(currentView) !== -1 ?
                            getPath(currentView) : getPath(state.tabSelected)
                    }
                >
                    <Tabs
                        tabItemContainerStyle={styles.container}
                        inkBarStyle={styles.inkBar}
                        value={
                            this.validTabNames.indexOf(currentView) !== -1 ?
                                currentView : state.tabSelected
                        }
                        onChange={this.handleTabSelect}
                    >
                        <Tab
                            style={styles.tab}
                            label={this.validTabNames[0]}
                            value={this.validTabNames[0]}
                        >
                            <div className="tab-content">
                                <Typography variant="body1" color="secondary">
                                    Payment History
                                </Typography>
                                <Typography variant="caption" color="secondary">
                                    Newest transactions shown as first.
                                </Typography>
                                <PaymentsTable />
                            </div>
                        </Tab>
                        {firebaseApp.auth("session").currentUser &&
                            this.props.userId && this.props.token &&
                            <Tab
                                style={styles.tab}
                                label={this.validTabNames[1]}
                                value={this.validTabNames[1]}
                            >
                                <div className="tab-content">
                                    <Transactions />
                                </div>
                            </Tab>
                        }
                    </Tabs>
                </Route>
                <Redirect to={getPath(state.tabSelected)} />
            </Switch>
    )(this.props)

}


// ...
export default compose(
    withStaticRouter,
    withDynamicRoutes,
    connect(
        // map state to props.
        (state) => ({
            state: state.Payments,
            transactions: state.StellarAccount.transactions,
            publicKey: state.LedgerHQ.publicKey,
            horizon: state.StellarAccount.horizon,
            userId: state.LoginManager.userId,
            token: state.LoginManager.token,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            setState: PaymentsAction.setState,
            setTransactions: StellarAccountAction.setTransactions,
        }, dispatch)
    ),
)(Payments)
