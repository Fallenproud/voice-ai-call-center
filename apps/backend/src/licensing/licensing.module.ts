import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LicensingService } from './licensing.service';
import { LicensingController } from './licensing.controller';
import { LicenseGuard } from './license.guard';

@Module({
  imports: [HttpModule],
  providers: [LicensingService, LicenseGuard],
  controllers: [LicensingController],
  exports: [LicensingService, LicenseGuard],
})
export class LicensingModule {}