export class ErrorData {
    private errorCode: number;
    private errorMessage: string;

    public constructor(errorCode: number, errorMessage: string) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    public getErrorCode(): number {
        return this.errorCode;
    }

    public getErrorMessage(): string {
        return this.errorMessage;
    }

}