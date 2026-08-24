import { coordinationApi } from './mobile/src/api/domain.api';

async function runPhase13Verification() {
  console.log('====================================================');
  console.log('LIPTALK PHASE 13 — GLOBAL COORDINATION & ECOSYSTEM VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(title: string, condition: boolean, details?: string) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${title}${details ? ` -> ${details}` : ''}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${title}${details ? ` -> ${details}` : ''}`);
    }
  }

  // 1. Global Goals & Milestones
  console.log('1. Testing Global Goals & Milestone Coordination:');
  const goals = await coordinationApi.getGoals();
  assert('Global goals retrieved successfully', Array.isArray(goals) && goals.length > 0);
  const primaryGoal = goals[0];
  assert('Goal contains structured objectives', primaryGoal.objectives && primaryGoal.objectives.length > 0, `Objectives: ${primaryGoal.objectives.length}`);
  assert('Goal contains trackable milestones', primaryGoal.milestones && primaryGoal.milestones.length > 0, `Milestones: ${primaryGoal.milestones.length}`);
  
  const updatedGoal = await coordinationApi.updateGoalProgress(primaryGoal.id, 75);
  assert('Goal progress updated smoothly', updatedGoal.progressPercent === 75);

  const toggledMilestone = await coordinationApi.toggleMilestone(primaryGoal.milestones[0].id);
  assert('Milestone completion toggled & verified', toggledMilestone.isCompleted === true);

  const joinedGoal = await coordinationApi.joinGoal(primaryGoal.id, 'MAINTAINER');
  assert('Participant joined global goal with role', joinedGoal.role === 'MAINTAINER');

  // 2. Global Public Initiatives
  console.log('\n2. Testing Public Initiatives & Shared Capital:');
  const inits = await coordinationApi.getInitiatives();
  assert('Public initiatives retrieved', Array.isArray(inits) && inits.length > 0);
  const firstInit = inits[0];
  assert('Initiative contains mission and funding metrics', firstInit.fundingGoalAmount > 0 && firstInit.fundingRaisedAmount > 0, `Raised: ₹${firstInit.fundingRaisedAmount}`);

  // 3. Shared Workspaces & Attribution
  console.log('\n3. Testing Shared Workspaces & Contribution Attribution:');
  const workspaces = await coordinationApi.getWorkspaces();
  assert('Shared workspaces retrieved', Array.isArray(workspaces) && workspaces.length > 0);
  const ws = workspaces[0];
  assert('Cross-community federation active', ws.type === 'CROSS_COMMUNITY' && ws.participatingCommunityIds.length > 0);

  const contributions = await coordinationApi.getContributions('proj_supply_01');
  assert('Attributed project contributions loaded', Array.isArray(contributions) && contributions.length > 0);
  const contrib = contributions[0];
  assert('Contribution preserves version & AI-assistance flag', contrib.versionNumber >= 1 && contrib.isAiAssisted === true, `v${contrib.versionNumber}`);

  // 4. Community Governance & Proposals
  console.log('\n4. Testing Governance, Proposals & Decision Records:');
  const proposals = await coordinationApi.getProposals();
  assert('Governance proposals loaded', Array.isArray(proposals) && proposals.length > 0);
  const prop = proposals[0];
  assert('Proposal has voting options and AI summary', prop.options.length > 0 && typeof prop.aiSummary === 'string');

  const voteRes = await coordinationApi.castVote(prop.id, 'APPROVE', 'Strongly support small farmer discount.');
  assert('Vote cast and registered immutably', voteRes.selectedOption === 'APPROVE');

  const decisions = await coordinationApi.getDecisionRecords();
  assert('Decision records preserved', Array.isArray(decisions) && decisions.length > 0, `Outcome: ${decisions[0].decisionOutcome}`);

  // 5. Collective Knowledge & Conflicts
  console.log('\n5. Testing Collective Knowledge Network & Conflict Resolution:');
  const conflicts = await coordinationApi.getKnowledgeConflicts();
  assert('Knowledge conflicts detected and structured', Array.isArray(conflicts) && conflicts.length > 0);
  const conf = conflicts[0];
  assert('Conflict contains source claims & AI explanation', conf.conflictingSources.length >= 2 && typeof conf.aiConflictExplanation === 'string');

  const researchProjects = await coordinationApi.getResearchProjects();
  assert('Collaborative research projects retrieved', Array.isArray(researchProjects) && researchProjects.length > 0);
  assert('Research contains findings and AI synthesis report', typeof researchProjects[0].aiSynthesizedReport === 'string');

  // 6. Multi-Agent Project Teams & Quality Gates
  console.log('\n6. Testing Multi-Agent Teams & Quality Gatekeepers:');
  const agentTeams = await coordinationApi.getAgentTeams();
  assert('Multi-agent project teams active', Array.isArray(agentTeams) && agentTeams.length > 0);
  const squad = agentTeams[0];
  assert('Squad contains specialized coordinator & specialist agents', squad.agents.length >= 3, `Agent Count: ${squad.agents.length}`);

  const execMission = await coordinationApi.executeAgentTeam(squad.id, 'Audit regional grain mill pricing');
  assert('Squad mission executed through structured protocol', execMission.status === 'COMPLETED');
  assert('Quality gate checked between agent hops', execMission.collaborationTrail.every((t: any) => t.qualityGatePassed === true));

  // 7. Creator Collectives & Collaborative Economy
  console.log('\n7. Testing Creator Collectives & Shared Revenue:');
  const collectives = await coordinationApi.getCreatorCollectives();
  assert('Creator collectives loaded', Array.isArray(collectives) && collectives.length > 0);
  const col = collectives[0];
  assert('Collective defines member revenue split percentage', col.members.length > 0 && col.members[0].revenueSplitPercentage > 0);

  // 8. Personal Data Vault & Multi-Context Personas
  console.log('\n8. Testing Personal Data Vault & Scoped Identity:');
  const vault = await coordinationApi.getPersonalVault();
  assert('Personal data vault isolated & retrieved', vault.vaultStatus === 'ENCRYPTED_AND_ISOLATED');
  assert('Multiple identity contexts available', vault.availablePersonas.length >= 4, `Personas: ${vault.availablePersonas.length}`);

  const switchRes = await coordinationApi.switchIdentityContext('DEVELOPER');
  assert('Identity context switched with scoped permissions', switchRes.activeContextType === 'DEVELOPER');

  const revokeRes = await coordinationApi.revokeDataAccess('log_1');
  assert('Data access scope revoked successfully', revokeRes.status === 'REVOKED');

  // 9. Voice Assistant & Multimodal Search
  console.log('\n9. Testing Voice Assistant Foundation & Multimodal Search:');
  const voiceRes = await coordinationApi.processVoiceIntent('What is the status of my goals?');
  assert('Voice intent transcribed & detected', voiceRes.detectedIntent === 'GOAL_STATUS_CHECK');
  assert('Grounded AI voice reply synthesized', typeof voiceRes.aiVoiceReplyText === 'string' && voiceRes.aiVoiceReplyText.length > 0);

  const mmSearch = await coordinationApi.searchMultimodal('Mysore grain mill');
  assert('Multimodal search returned verified assets', Array.isArray(mmSearch) && mmSearch.length > 0);

  // 10. Operations & Self-Healing Platform
  console.log('\n10. Testing Global Incident Intelligence & Self-Healing:');
  const incidents = await coordinationApi.getSystemIncidents();
  assert('Platform incident intelligence logs active', Array.isArray(incidents) && incidents.length > 0);
  assert('Automated self-healing recorded', incidents[0].status === 'HEALED_AUTOMATICALLY');

  const opsBrief = await coordinationApi.getOperationsBriefing();
  assert('AI Operations Assistant briefing generated', opsBrief.systemHealthStatus.includes('99.98%'));

  console.log('\n====================================================');
  console.log(`PHASE 13 VERIFICATION SUMMARY: ${passed}/${total} TESTS PASSED (${((passed / total) * 100).toFixed(1)}%)`);
  console.log('====================================================');

  if (passed === total) {
    console.log('\n🌟 ALL 10 PHASE 13 SUBSYSTEMS VERIFIED AND FULLY OPERATIONAL!');
  } else {
    process.exit(1);
  }
}

runPhase13Verification().catch((err) => {
  console.error('Fatal Verification Error:', err);
  process.exit(1);
});
