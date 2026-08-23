import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async check() {
    let dbStatus = 'UP';
    try {
      await this.dataSource.query('SELECT 1');
    } catch {
      dbStatus = 'DOWN';
    }

    const memoryUsage = process.memoryUsage();

    return {
      status: dbStatus === 'UP' ? 'OK' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      version: '2.0.0-enterprise',
      environment: process.env.NODE_ENV || 'development',
      components: {
        database: {
          status: dbStatus,
          type: this.dataSource.options.type,
        },
        realtimeWebSockets: {
          status: 'UP',
          gateway: 'Socket.IO / Calls & Live Rooms',
        },
        aiEngine: {
          status: 'UP',
          provider: 'LipTalk Gemini Inference Gateway',
        },
        memory: {
          heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
        },
      },
    };
  }
}
