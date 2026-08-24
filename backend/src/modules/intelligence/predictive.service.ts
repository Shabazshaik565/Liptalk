import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EcosystemPrediction, PredictionDomain } from '../../database/entities/ecosystem-prediction.entity';

@Injectable()
export class PredictiveService {
  constructor(
    @InjectRepository(EcosystemPrediction)
    private readonly predictionRepo: Repository<EcosystemPrediction>,
  ) {}

  async listPredictions(domain?: PredictionDomain) {
    const list = await this.predictionRepo.find({ where: domain ? { domain } : {} });
    if (list.length > 0) return list;

    // Seed probabilistic predictions across key domains
    return [
      {
        id: 'pred_comm_01',
        domain: 'COMMUNITY_GROWTH' as PredictionDomain,
        targetEntityId: 'comm_kirana_01',
        predictionTitle: 'Kirana Wholesale Guild Active Trader Inflow',
        forecastStatement: 'Community is projected to add 420–580 verified merchants over the next 90 days.',
        confidenceScore: 0.89,
        uncertaintyBand: {
          lowerBound: 420,
          expectedValue: 510,
          upperBound: 580,
          unit: 'New Verified Members',
        },
        influencingSignals: [
          { signalName: 'Regional Mandi harvest cycle', weight: 0.45, observation: 'Peak post-monsoon trading window' },
          { signalName: 'Open Escrow API adoption', weight: 0.35, observation: '14 new mill partners integrated' },
          { signalName: 'Event referral conversion', weight: 0.20, observation: 'High summit sign-up velocity' },
        ],
        aiExplanationRationale: 'Strong historical correlation between regional milling cycles and cooperative network formation.',
        horizon: 'NEXT_90_DAYS',
      },
      {
        id: 'pred_mkt_01',
        domain: 'MARKETPLACE_DEMAND' as PredictionDomain,
        targetEntityId: 'listing_grain_01',
        predictionTitle: 'Premium Mysore Wheat Spot Demand Surge',
        forecastStatement: 'Demand for certified wheat spot lots expected to increase by 28% next month.',
        confidenceScore: 0.84,
        uncertaintyBand: {
          lowerBound: 20,
          expectedValue: 28,
          upperBound: 36,
          unit: 'Percent Demand Delta',
        },
        influencingSignals: [
          { signalName: 'South India flour mill tender tenders', weight: 0.50, observation: 'Institutional bids opened' },
          { signalName: 'Escrow volume velocity', weight: 0.30, observation: 'Sub-48h settlement turnaround' },
        ],
        aiExplanationRationale: 'Escrow settlement speed is accelerating re-order frequency among repeat procurement buyers.',
        horizon: 'NEXT_30_DAYS',
      },
      {
        id: 'pred_infra_01',
        domain: 'INFRASTRUCTURE_LOAD' as PredictionDomain,
        targetEntityId: 'edge_ap_south_01',
        predictionTitle: 'South Asia Edge Inference Peak Capacity',
        forecastStatement: 'Edge API request load estimated at 12,400 req/min during AgTech Summit livestream.',
        confidenceScore: 0.94,
        uncertaintyBand: {
          lowerBound: 10500,
          expectedValue: 12400,
          upperBound: 14800,
          unit: 'Requests Per Minute',
        },
        influencingSignals: [
          { signalName: 'Pre-registered livestream attendees', weight: 0.60, observation: '3,800 active registrations' },
          { signalName: 'Multimodal voice queries baseline', weight: 0.40, observation: 'Voice intent traffic up 18%' },
        ],
        aiExplanationRationale: 'Auto-scaling policy has pre-allocated 4 standby edge worker instances in Mumbai & Bangalore.',
        horizon: 'PEAK_HOURS',
      },
    ];
  }
}
