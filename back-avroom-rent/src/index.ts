import app from './app';
import { logger } from './config/logger.config';

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
