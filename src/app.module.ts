import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CatsModule } from './cats/cats.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Mark global to make available to all modules.
      expandVariables: true, // Expand variables to allow use of variables within the env file.
      envFilePath: !ENV ? '.env' : `.env.${ENV}`, // Use the .env file based on the NODE_ENV var set in package.json.
    }),
    // Initialise the DB connection, using a factory to load the connection string from env vars.
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGO_CONNECTION_STRING'),
      }),
    }),
    CatsModule,
  ],
})
export class AppModule {}
