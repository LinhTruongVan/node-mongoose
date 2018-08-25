import { Request, Response } from "express";
import createError, { HttpError } from "http-errors";

import logger from "./logger";
import responseFactory from "./responseFactory";

export default (err: any, req: Request, res: Response) => {
  if (err.status) {
    return responseFactory.createErrorResponse(res, <HttpError>err);
  }
  logger.error("500", err);
  return responseFactory.createErrorResponse(
    res,
    new createError.InternalServerError(
      "Something went wrong, please try again later"
    )
  );
};
