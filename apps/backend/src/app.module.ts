import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './common/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CallsModule } from './calls/calls.module';
import { LicensingModule } from './licensing/licensing.module';
import { PipelineModule } from './pipeline/pipeline.module';
import { IntegrationsModule } from './integrations/integrations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    HttpModule,
    PrismaModule,
    AuthModule,
    CallsModule,
    LicensingModule,
    PipelineModule,
    IntegrationsModule,
  ],
})
export class AppModule {}