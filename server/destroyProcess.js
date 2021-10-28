const subscriptions = []

/**
 * Performs the specified action when the process is indicated to exit.
 * @param callbackfn A function that accepts two arguments.
 * subscribeOnExit calls the callbackfn function when the
 * process should exit.
 */
const subscribeOnExit = (callbackfn) => {
  subscriptions.push(callbackfn)
}

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
