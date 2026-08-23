import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadStatus } from '../../database/entities/lead.entity';

@Controller('leads')
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  @Get()
  getLeads(@Query('businessId') businessId?: string) {
    return this.service.getLeads(businessId);
  }

  @Post()
  createLead(@Body() body: any) {
    return this.service.createLead(body);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: LeadStatus }) {
    return this.service.updateLeadStatus(id, body.status);
  }

  @Post(':id/notes')
  addNote(@Param('id') id: string, @Body() body: { authorId?: string; noteText: string }) {
    const authorId = body.authorId || 'usr_curr_01';
    return this.service.addNote(id, authorId, body.noteText);
  }
}
