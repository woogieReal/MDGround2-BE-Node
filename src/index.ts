import 'reflect-metadata';
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { container } from '../src/config/ioc.container'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';

import fileUpload from 'express-fileupload';
import express from 'express';

// create server
let server = new InversifyExpressServer(container);
server.setConfig((app) => {
  app.use(cors({
    origin: 'http://localhost:5001',
    credentials: true
  }))
  app.use(cookieParser());
  app.use(fileUpload());

  // add body parser
  app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.json());
});
 
let app = server.build();
app.listen(8099);