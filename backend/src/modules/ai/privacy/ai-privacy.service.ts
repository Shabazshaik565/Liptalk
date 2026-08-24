import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AiPrivacyService {
  private readonly logger = new Logger(AiPrivacyService.name);

  // High-risk credential and PII patterns
  private readonly SENSITIVE_PATTERNS: Array<{ regex: RegExp; replacement: string }> = [
    { regex: /bearer\s+[A-Za-z0-9\-_.]+/gi, replacement: '[BEARER_TOKEN_REDACTED]' },
    { regex: /api[_-]?key\s*[:=]\s*['"]?[A-Za-z0-9\-_.]+['"]?/gi, replacement: 'api_key:[REDACTED]' },
    { regex: /password\s*[:=]\s*['"]?[^\s,;]+['"]?/gi, replacement: 'password:[REDACTED]' },
    { regex: /secret\s*[:=]\s*['"]?[^\s,;]+['"]?/gi, replacement: 'secret:[REDACTED]' },
    { regex: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, replacement: '[CARD_NUMBER_REDACTED]' },
    { regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g, replacement: '[EMAIL_REDACTED]' },
    { regex: /\b(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/g, replacement: '[PHONE_REDACTED]' },
  ];

  /**
   * Minimizes and sanitizes user/system context before passing to LLM
   */
  sanitizeContext(
    contextText: string,
    classification: 'STANDARD' | 'MINIMAL' | 'STRICT_ANONYMIZED' = 'STANDARD',
  ): string {
    if (!contextText) return '';

    let clean = contextText;

    // 1. Redact prompt injection attempts
    clean = clean
      .replace(/ignore\s+previous\s+instructions/gi, '[filtered_instruction]')
      .replace(/you\s+are\s+now\s+in\s+developer\s+mode/gi, '[filtered_instruction]')
      .replace(/<\/?script>/gi, '');

    // 2. Redact credentials and PII
    for (const { regex, replacement } of this.SENSITIVE_PATTERNS) {
      if (classification === 'STRICT_ANONYMIZED' || regex.source.includes('token') || regex.source.includes('password')) {
        clean = clean.replace(regex, replacement);
      }
    }

    // 3. Length minimization
    const maxLen = classification === 'MINIMAL' ? 500 : 2000;
    return clean.slice(0, maxLen).trim();
  }

  /**
   * Validates if text contains prohibited credential leakage
   */
  hasCredentialLeakage(text: string): boolean {
    if (!text) return false;
    return /bearer\s+[A-Za-z0-9\-_.]+/i.test(text) || /password\s*[:=]/i.test(text);
  }
}
