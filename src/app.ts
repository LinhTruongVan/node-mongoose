import express, { Response } from "express";
import "express-async-errors";
import compression from "compression";
import bodyParser from "body-parser";

import notFoundErrorHandler from "./utils/notFoundErrorHandler";
import globalErrorHandler from "./utils/globalErrorHandler";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error handling
app.use(notFoundErrorHandler);
app.use(globalErrorHandler);

export default app;
