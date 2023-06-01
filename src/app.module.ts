import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ApiController } from './controllers/api.controller';
import { AuthService } from './services/auth.service';
import { UserRepo } from './repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { ConsumptionHistorySchema } from './schemas/consumption-history.schema';
import { ConsumptionHistoryRepo } from './repositories/consumption-history.repository';
import { ConsumptionHistoryService } from './services/consumption-history.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: '8BC14C7E2421EAE512157F98386C9',
      signOptions: { expiresIn: '30d' },
    }),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DSN),
    MongooseModule.forFeature([
      {
        name: 'user',
        schema: UserSchema
      },
      {
        name: 'consumption_history',
        schema: ConsumptionHistorySchema
      }
    ])
  ],
  controllers: [AppController, ApiController],
  providers: [
    AppService,

    AuthService,
    UserService,
    ConsumptionHistoryService,

    UserRepo,
    ConsumptionHistoryRepo,

    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
})
export class AppModule {}
