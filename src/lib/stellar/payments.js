import { server, testNet } from "./server"




// ...
const getPlusMinus = (record, accountId) => {
    if (["payment", "path_payment"].some(
        (element) => element === record.type)
    ) {
        if (record.to === accountId) {
            return "+"
        }
    }
    return "-"
}





/**
 * @typedef {Object} FetchOptions
 * @property {Number} [limit] Number of transactions returned.
 * @property {String} [order] Order of returned rows.
 * @property {Any} [cursor] Paging token, specifying where to start returning records from.
 * @property {String} [horizon] Horizon API endpoint.
 */
/**
 * @typedef {Object} PageObject
 * @property {Function} [next] Returns next records.
 * @property {Function} [prev] Returns previous records.
 * @property {Array} [records] Array of record objects.
 */
/**
 * Return payments for the Stellar Account.
 * The operation falls under "Payments" category if its type is in one of the
 * following categories: "create_account", "payment", "path_payment" or
 * "account_merge"
 *
 * @async
 * @function payments
 * @param {String} [accountId] Stellar account id. [G...]
 * @param {FetchOptions} [opts={}]
 * @returns {Promise.<PageObject>}
 */
export const payments = (
    accountId,
    {
        limit = 5,
        order = "desc",
        horizon = testNet,

    } = {}
) => server(horizon)
    .payments()
    .forAccount(accountId)
    .order(order)
    .limit(limit)
    .call()




/**
 * @typedef {Object} Record
 * @property {Function} [next] Returns next records.
 * @property {Function} [prev] Returns previous records.
 * @property {Array} [records] Array of record objects.
 */
/**
 * Returns the amount of the payment based on the type of payment record.
 *
 * @async
 * @function getAmountWithSign
 * @param {Record} [record] Payment record.
 * @returns {Object} Amount in native currency (XLM) along with the arithmetic sign +-.
 */
export const getAmountWithSign = (record, accountId) => {
    if (["payment", "path_payment"].some(
        (element) => element === record.type)
    ) {
        return Promise.resolve({
            sign: getPlusMinus(record, accountId),
            value: record.amount,
        })
    }

    if (record.type === "create_account") {
        return Promise.resolve({
            sign: record.account === accountId ? "+" : "-",
            value: record.starting_balance,
        })
    }

    if (record.type === "account_merge") {
        return record.effects().then((effects) => {
            let value = ""
            let sign = ""
            effects.records.forEach((record) => {
                if (record.account === accountId) {
                    if (record.type === "account_debited") {
                        value = record.amount
                        sign = "-"
                        return
                    }
                    if (record.type === "account_credited") {
                        value = record.amount
                        sign = "+"
                        return
                    }
                }
            })
            return { sign, value }
        })
    }
}
