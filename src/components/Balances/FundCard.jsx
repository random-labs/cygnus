import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import { bindActionCreators, compose } from "redux"
import { Typography, withStyles } from "@material-ui/core"
import { action as BalancesAction } from "../../redux/Balances"
import StripeCheckout from "../StripeCheckout"
import { Card, CardActions, CardHeader, CardText } from "material-ui/Card"
import Button from "../../lib/mui-v1/Button"
import Divider from "../../lib/mui-v1/Divider"
import { withLoginManager } from "../LoginManager"
import { testNetAddr } from "../StellarFox/env"




export default compose(
    withLoginManager,
    withStyles({
        cardActions: {
            padding: "1rem",
        },
    }),
    connect(
        (state) => ({
            fundCardVisible: state.Balances.fundCardVisible,
            horizon: state.StellarAccount.horizon,
            publicKey: state.LedgerHQ.publicKey,
        }),
        (dispatch) => bindActionCreators({
            setState: BalancesAction.setState,
        }, dispatch)
    ),
)(

    class FundCard extends Component {

        // ...
        toggleFundCard = () =>
            this.props.setState({
                fundCardVisible: !this.props.fundCardVisible,
            })

        // ...
        render = () => (
            ({ classes, publicKey }) => <Card className='account'>
                <CardHeader
                    title={
                        <span>
                            <span>Fund your account.</span>
                        </span>
                    }
                    subtitle="Use available methods below to purchase transfer tokens."
                    actAsExpander={false}
                    showExpandableButton={false}
                />

                <CardText>
                    {this.props.loginManager.isAuthenticated() &&
                        this.props.horizon === testNetAddr &&
                        <Fragment>
                            <Typography variant="subtitle1" color="inherit">
                                Fund with Credit Card.
                                <Typography variant="caption" color="inherit">
                                    Minimum amount is an equivalent of 0.50 €.
                                </Typography>
                            </Typography>
                            <div className="p-t"></div>
                            <StripeCheckout />
                            <div className="p-t p-b">
                                <Divider />
                            </div>
                        </Fragment>
                    }
                    <Typography variant="subtitle1" color="inherit">
                        Fund with Stellar Lumens.
                        <Typography variant="caption" color="inherit">
                            Send any amount of Stellar Lumens to the
                            following address.
                        </Typography>
                    </Typography>
                    <div className="p-l p-t-small bg-green">
                        {publicKey}
                    </div>
                </CardText>

                <CardActions classes={{ root: classes.cardActions }}>
                    <div className="f-e">
                        <Button color="primary" onClick={this.toggleFundCard}>
                            Done
                        </Button>
                    </div>
                </CardActions>
            </Card>)(this.props)
    }
)

