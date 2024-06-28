export class ApiError extends Error{
    httpStatusCode: number;
    constructor(httpStatusCode:number, message:string){
        super(message);
        this.httpStatusCode = httpStatusCode;
    }
}