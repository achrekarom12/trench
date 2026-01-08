import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'database.sqlite',
            entities: [User],
            synchronize: true, // Set to false in production
            logging: true,
        }),
        AuthModule,
    ],
})
export class AppModule { }
