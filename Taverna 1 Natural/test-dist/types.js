export class DiceEngineError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.name = 'DiceEngineError';
        this.code = code;
        Object.setPrototypeOf(this, DiceEngineError.prototype);
    }
}
