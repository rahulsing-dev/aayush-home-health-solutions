/**
 * Form submission (Web3Forms by default: https://docs.web3forms.com). Three honest outcomes:
 *  - 'sent'  : a real endpoint is configured and it accepted the request.
 *  - 'demo'  : no endpoint configured. NOTHING was sent. The UI says so.
 *  - 'error' : endpoint configured but the request failed, timed out or was refused.
 */
import { formatISODateLong } from './format';
import type { FormKind, FormValues } from './validation';

export type SubmitResult =
  | { status: 'sent' }
  | { status: 'demo' }
  | { status: 'error'; message: string };

export interface SubmitConfig {
  endpoint: string;
  accessKey?: string;
  /** Give up after this long (default 20 s) so the visitor is never left with a spinner. */
  timeoutMs?: number;
  /** Injectable for tests. */
  fetchImpl?: typeof fetch;
}

export const requestTypeLabel = (kind: FormKind) => (kind === 'booking' ? 'Service booking' : 'General enquiry');

/**
 * The JSON body. Web3Forms forwards every non-reserved key into the notification email as-is,
 * so keys are short readable labels and empty optional fields are left out.
 * Reserved keys used: `access_key`, `subject`, `from_name`, and `email` (becomes the reply-to).
 * The honeypot (`botcheck`) is never sent: a ticked honeypot is dropped before this is called.
 */
export function buildPayload(kind: FormKind, values: FormValues, accessKey?: string): Record<string, string> {
  const t = (k: keyof FormValues) => (values[k] ?? '').trim();
  const payload: Record<string, string> = {
    subject: `${kind === 'booking' ? 'Booking request' : 'Enquiry'}: ${t('service')} – ${t('fullName')}`,
    request_type: requestTypeLabel(kind),
    name: t('fullName'),
    phone: t('phone'),
  };
  const optional: [string, string][] = [
    ['email', t('email')],
    ['area', t('city')],
    ['service', t('service')],
    ['preferred_date', t('date') ? formatISODateLong(t('date')) : ''],
    ['package', t('package')],
    ['notes', t('message')],
  ];
  for (const [k, v] of optional) if (v) payload[k] = v;
  if (accessKey) {
    payload.access_key = accessKey;
    payload.from_name = 'Aayush Home Health website';
  }
  return payload;
}

export async function submitForm(kind: FormKind, values: FormValues, cfg: SubmitConfig): Promise<SubmitResult> {
  if (!cfg.endpoint) return { status: 'demo' };

  const controller = typeof AbortController === 'function' ? new AbortController() : undefined;
  const timer = controller ? setTimeout(() => controller.abort(), cfg.timeoutMs ?? 20_000) : undefined;
  try {
    const res = await (cfg.fetchImpl ?? fetch)(cfg.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(buildPayload(kind, values, cfg.accessKey)),
      signal: controller?.signal,
    });
    if (res.status === 429) return { status: 'error', message: 'Too many messages were sent from this connection. Please wait a minute and try again.' };
    if (!res.ok) return { status: 'error', message: `The form service responded with an error (status ${res.status}).` };
    // Web3Forms replies { success: true | false, ... }. A 2xx with success:false is NEVER reported as sent.
    const body = await res.json?.().catch(() => null);
    if (body && typeof body === 'object' && (body as { success?: unknown }).success === false) {
      return { status: 'error', message: 'The form service did not accept the message.' };
    }
    return { status: 'sent' };
  } catch (err) {
    const aborted = err instanceof Error && err.name === 'AbortError';
    return { status: 'error', message: aborted ? 'The request took too long.' : 'We could not reach the form service. Please check your internet connection.' };
  } finally {
    if (timer) clearTimeout(timer);
  }
}
