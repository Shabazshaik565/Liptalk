import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, LeadStatus, LeadSource } from '../../database/entities/lead.entity';
import { LeadNote } from '../../database/entities/lead-note.entity';
import { Business } from '../../database/entities/business.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>,
    @InjectRepository(LeadNote)
    private readonly noteRepo: Repository<LeadNote>,
    @InjectRepository(Business)
    private readonly bizRepo: Repository<Business>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getLeads(businessId?: string) {
    return this.leadRepo.find({
      relations: ['business', 'contactUser', 'contactUser.profile', 'opportunity', 'notes'],
      order: { updatedAt: 'DESC' },
    });
  }

  async createLead(data: {
    businessId: string;
    contactUserId: string;
    opportunityId?: string;
    title: string;
    source?: LeadSource;
    estimatedValue?: number;
  }) {
    const business = await this.bizRepo.findOne({ where: { id: data.businessId } });
    const contactUser = await this.userRepo.findOne({ where: { id: data.contactUserId } });

    const lead = this.leadRepo.create({
      business: business || undefined,
      contactUser: contactUser || undefined,
      title: data.title,
      source: data.source || LeadSource.MATCH,
      status: LeadStatus.NEW,
      estimatedValue: data.estimatedValue || 100000,
    });

    return this.leadRepo.save(lead);
  }

  async updateLeadStatus(leadId: string, status: LeadStatus) {
    const lead = await this.leadRepo.findOne({ where: { id: leadId } });
    if (!lead) return null;

    lead.status = status;
    lead.updatedAt = new Date();
    return this.leadRepo.save(lead);
  }

  async addNote(leadId: string, authorId: string, noteText: string) {
    const lead = await this.leadRepo.findOne({ where: { id: leadId } });
    const author = await this.userRepo.findOne({ where: { id: authorId } });
    if (!lead || !author) return null;

    const note = this.noteRepo.create({
      lead,
      author,
      noteText,
    });
    return this.noteRepo.save(note);
  }
}
