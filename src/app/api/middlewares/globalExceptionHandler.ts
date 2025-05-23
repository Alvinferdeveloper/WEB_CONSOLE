import { NextResponse } from "next/server";
import { ApiError } from "../utils/ApiError";

const globalExceptionHandler = <T>(fn: (req: Request, { params }: { params: Promise<T> }) => Promise<any>) => async (req: Request, { params }: { params: Promise<T> }) => {
    try {
        const resp = await fn(req, { params });
        return NextResponse.json(resp);
    }
    catch (err) {
        const typedError = err as ApiError;
        return NextResponse.json({ message: typedError.message, status: typedError.httpStatusCode }, { status: typedError.httpStatusCode });
    };
}

export default globalExceptionHandler;