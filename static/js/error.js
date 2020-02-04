export class ValidationError {
    constructor(message) {
        this.name = 'ValidationError'
        this.message = message
    }
}

class PermissionError {
    constructor(message) {
        this.name = 'PermissionError'
        this.message = message
        }
}

class DatabaseError {
    constructor(message) {
        this.name = 'DatabaseError'
        this.message = message
        }
}