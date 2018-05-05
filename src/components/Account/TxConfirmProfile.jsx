import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
    List,
    ListItem,
} from "material-ui/List"
import Divider from "../../lib/mui-v1/Divider"
import {
    htmlEntities as he,
} from "../../lib/utils"




// ...
export default connect(
    // map state to props.
    (state) => ({
        fingerprintUserData: state.Account.fingerprintUserData,
    })
)(
    ({ fingerprintUserData, }) =>
        <Fragment>
            <div className="p-t centered">
                The following data fingerprint will be lodged to your account:
            </div>
            <div className="p-t centered">
                <span className="bg-green">
                    {btoa(fingerprintUserData)}
                </span>
            </div>
            <Divider />
            <div className="p-t centered">
                You should see the following info on your
                device<he.Apos />s screen:
            </div>
            <div className="f-b space-around">
                <List>
                    <ListItem
                        disabled={true}
                        primaryText="No Details Available"
                        leftIcon={
                            <i className="text-primary material-icons">
                                style
                            </i>
                        }
                    />
                    <ListItem
                        disabled={true}
                        primaryText="Hash"
                        leftIcon={
                            <i className="text-primary material-icons">
                                account_balance_wallet
                            </i>
                        }
                    />
                </List>
            </div>
            <div className="p-b centered">
                Press <span className="bigger text-primary"><he.Check /></span>
                on the device to confirm your profile data update.
            </div>
        </Fragment>
)
