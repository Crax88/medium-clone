import { NextFunction, Request, Response } from 'express';

export interface ExceptionFilterInterface {
	catch: (err: Error, req: Request, res: Response, next: NextFunction) => void;
}
