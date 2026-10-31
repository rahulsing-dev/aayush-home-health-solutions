/**
 * Form submission. Three honest outcomes:
 *  - 'sent'  : a real endpoint is configured and it accepted the request.
 *  - 'demo'  : no endpoint configured. NOTHING was sent. The UI says so.
 *  - 'error' : endpoint configured but the request failed.
 */
import type { FormKind, FormValues } from './validation';

export type SubmitResult =
  | { status: 'sent' }
  | { status: 'demo' }
  | { status: 'error'; message: string };

export interface SubmitConfig {
  endpoint: string;
  accessKey?: string;
  /** Injectable for tests. */
  fetchImpl?: typeof fetch;
}

export async function submitForm(kind: FormKind, values: FormValues, cfg: SubmitConfig): Promise<SubmitResult> {
  if (!cfg.endpoint) return { status: 'demo' };

  const { website: _honeypot, ...fields } = values;
  const payload: Record<string, string> = {
    ...fields,
    formType: kind === 'booking' ? 'Book a Service' : 'Make an Enquiry',
    subject: `${kind === 'booking' ? 'Service booking' : 'Enquiry'} from ${values.fullName}`,
  };
  if (cfg.accessKey) payload.access_key = cfg.accessKey;

  try {
    const res = await (cfg.fetchImpl ?? fetch)(cfg.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { status: 'error', message: `The server responded with status ${res.status}.` };
    return { status: 'sent' };
  } catch {
    return { status: 'error', message: 'We could not reach the server. Please check your connection.' };
  }
}
