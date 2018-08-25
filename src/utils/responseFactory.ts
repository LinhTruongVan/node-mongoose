import { Response } from "express";
import { HttpError } from "http-errors";

const createOkResponse = (res: Response, data: any): Response => {
  return res.status(200).json({ data: data });
};

const createCreatedResponse = (res: Response, data: any): Response => {
  return res.status(201).json({ data: data });
};

const createErrorResponse = (res: Response, err: HttpError): Response => {
  const { status, message } = err;
  return res.status(status).json({ error: { status, message } });
};

export default {
  createOkResponse,
  createCreatedResponse,
  createErrorResponse
};
