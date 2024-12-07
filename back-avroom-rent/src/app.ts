import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
// import swaggerUi from 'swagger-ui-express';
import { morganMiddleware } from './middlewares/logger.middleware';
import express from 'express';
import { connectToDatabase } from './config/mongo.config';
import { deviceRoutes } from './routes/routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(morganMiddleware);

connectToDatabase();
app.use('/api', deviceRoutes);

export default app;
