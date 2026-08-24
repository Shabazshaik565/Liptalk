import { Controller, Get, Post, Body, Param, Patch, Request } from '@nestjs/common';
import { UniversalService } from './universal.service';

@Controller('universal')
export class UniversalController {
  constructor(private readonly universalService: UniversalService) {}

  @Post('command')
  async executeCommand(@Body() body: { input: string; context?: Record<string, any> }, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.universalService.executeUniversalCommand(userId, body.input, body.context);
  }

  @Get('dashboard')
  async getDashboard(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.universalService.getPersonalDashboard(userId);
  }

  @Post('goals')
  async createGoal(@Body() body: any, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.universalService.createPersonalGoal(userId, body);
  }

  @Post('tasks')
  async createTask(@Body() body: any, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.universalService.createPersonalTask(userId, body);
  }

  @Patch('tasks/:id/toggle')
  async toggleTask(@Param('id') id: string) {
    return this.universalService.togglePersonalTask(id);
  }

  @Post('ambient-query')
  async ambientQuery(@Body() body: { screenContext: string; query: string }, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.universalService.queryAmbientContext(userId, body.screenContext, body.query);
  }

  @Post('simulate-workflow')
  async simulateWorkflow(@Body() body: { title: string; trigger: string; steps: string[] }) {
    return this.universalService.simulateWorkflow(body);
  }
}
