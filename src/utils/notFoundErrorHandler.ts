import { Request, Response } from "express";
import createError from "http-errors";

import responseFactory from "./responseFactory";

export default (req: Request, res: Response) => {
  return responseFactory.createErrorResponse(res, new createError.NotFound());
};
