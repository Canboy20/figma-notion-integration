export class ApiError extends Error {
     statusCode: number;
     message: string;

    public constructor(status: number, message: string) {
        super()
        this.statusCode = status;
        this.message = message;
    }

    public getStatusCode(): number {
        return this.statusCode;
    }

    public getMessage(): string {
        return this.message;
    }

}