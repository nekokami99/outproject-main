import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';

const logger = new Logger('outproj');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: '*'
    },
  });

  const bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('combined'));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT);
  logger.log('app running at port ' + process.env.PORT)
}
bootstrap();