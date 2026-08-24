import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeveloperApp } from '../../database/entities/developer-app.entity';
import { Webhook } from '../../database/entities/webhook.entity';

@Injectable()
export class DeveloperService {
  private readonly logger = new Logger(DeveloperService.name);

  constructor(
    @InjectRepository(DeveloperApp)
    private readonly appRepo: Repository<DeveloperApp>,
    @InjectRepository(Webhook)
    private readonly webhookRepo: Repository<Webhook>,
  ) {}

  /**
   * Get all developer apps owned by user
   */
  async getUserApps(developerId: string): Promise<DeveloperApp[]> {
    let apps = await this.appRepo.find({
      where: { developerId },
      order: { createdAt: 'DESC' },
    });

    if (apps.length === 0) {
      // Seed default developer app
      const defaultApp = this.appRepo.create({
        developerId,
        name: 'Nexas B2B Enterprise Connector',
        description: 'Syncs marketplace opportunities and lead pipelines to internal CRM tools.',
        apiKey: 'ltk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        redirectUri: 'https://nexastech.com/oauth/callback',
        scopes: ['read:profile', 'read:marketplace', 'write:opportunities', 'read:leads'],
        rateLimitPerMinute: 1200,
        isActive: true,
      });
      apps = [await this.appRepo.save(defaultApp)];
    }

    return apps;
  }

  /**
   * Create a new developer app
   */
  async createApp(developerId: string, data: { name: string; description?: string; redirectUri?: string; scopes?: string[] }): Promise<DeveloperApp> {
    const app = this.appRepo.create({
      developerId,
      name: data.name,
      description: data.description,
      apiKey: 'ltk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      redirectUri: data.redirectUri,
      scopes: data.scopes || ['read:profile', 'read:marketplace'],
      rateLimitPerMinute: 1000,
      isActive: true,
    });
    return this.appRepo.save(app);
  }

  /**
   * Roll API Key
   */
  async rollApiKey(developerId: string, appId: string): Promise<DeveloperApp> {
    const app = await this.appRepo.findOne({ where: { id: appId, developerId } });
    if (!app) throw new NotFoundException('Developer App not found');

    app.apiKey = 'ltk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return this.appRepo.save(app);
  }

  /**
   * Get webhooks for an app
   */
  async getWebhooks(appId: string): Promise<Webhook[]> {
    return this.webhookRepo.find({
      where: { app: { id: appId } },
      relations: ['app'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Register a webhook
   */
  async createWebhook(appId: string, targetUrl: string, subscribedEvents: string[]): Promise<Webhook> {
    const app = await this.appRepo.findOne({ where: { id: appId } });
    if (!app) throw new NotFoundException('Developer App not found');

    const webhook = this.webhookRepo.create({
      app,
      targetUrl,
      secretToken: 'whsec_' + Math.random().toString(36).substring(2, 15),
      subscribedEvents,
      isActive: true,
      deliveriesCount: 0,
      failuresCount: 0,
    });
    return this.webhookRepo.save(webhook);
  }

  /**
   * Platform Event Dispatcher Simulation
   */
  async dispatchEvent(eventName: string, payload: Record<string, any>) {
    this.logger.log(`Dispatched platform event: ${eventName}`);
    // In production, this pushes to message queues (e.g. BullMQ / RabbitMQ) for reliable delivery & signing
    return { dispatched: true, eventName, timestamp: new Date().toISOString() };
  }
}
