/**
 * Callback for exiting the process.
 * @callback ExitCallback
 * @param {*} err thrown error
 * @param {number} code error code
 */

/**
 * Collection of callback functions for exiting.
 * @type {ExitCallback[]}
 */
const subscriptions = []

/**
 * Calls the provided function when the process is indicated to exit.
 * @param {ExitCallback} callbackfn A function that accepts two arguments: **err**, **code**
 */
const subscribeOnExit = (callbackfn) => {
  subscriptions.push(callbackfn)
}

/**
 * Removes all the callback functions that are called when the process exits.
 */
const unsubscribeAll = () => {
  subscriptions.splice(0)
}

/**
 * Notify subscribers to exit process with code.
 * @param {*} err
 * @param {Number} code
 */
const exitProcess = (err, code) => {
  subscriptions.forEach((callbackfn) => callbackfn(err, code))
}

module.exports = { subscribeOnExit, exitProcess, unsubscribeAll }
