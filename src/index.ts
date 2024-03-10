import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import http from 'http'
import cors from 'cors'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';

import router from './routes';
import logger from './utils/logger';
import swaggerFile from "../swagger/swagger-output.json";

dotenv.config();
const app = express();
const mongoUri = process.env.MONGODB_URL || 'mongodb://localhost:27017/fashionsocial';

const s_options = {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Nico Social API",
  customfavIcon: "/assets/favicon.png",
  docExpansion: "none",
  explorer: true,
};

//@ts-ignore
mongoose.connect(mongoUri).then(() => logger.log('info', 'MongoDB Connected')).catch(err => logger.log('error', err));


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
app.options('*', cors()); // Enable preflight for all routes

app.use(compression());

// Routes
app.use('/api', router);

//Initialize swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, s_options));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const server = http.createServer(app);

server.listen(process.env.PORT || 8000, () => {
  logger.log('info', `Server running on http://${process.env.HOST}:${process.env.PORT}`);
});
