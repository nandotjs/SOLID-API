export class LateCheckInError extends Error {
    constructor() {
        super('The check-in can only be validates until 20 minutes.')
    }
}