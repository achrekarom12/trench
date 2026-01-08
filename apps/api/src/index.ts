import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3031', 'http://127.0.0.1:3031'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Set global prefix
    app.setGlobalPrefix('api/v1');

    // Swagger/OpenAPI configuration
    const config = new DocumentBuilder()
        .setTitle('Trench API')
        .setDescription('API documentation for Trench authentication service')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);

    // Use Scalar for API documentation
    app.use(
        '/reference',
        apiReference({
            spec: {
                content: document,
            },
            theme: 'purple',
        }),
    );

    const port = process.env.PORT || 3030;
    const host = process.env.HOST || 'localhost';

    await app.listen(port, host);
    console.log(`🚀 Trench API running on http://${host}:${port}/api/v1`);
    console.log(`📚 API Documentation available at http://${host}:${port}/reference`);
}

bootstrap();
