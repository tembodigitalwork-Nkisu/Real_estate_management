'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { CheckCircle2 } from 'lucide-react';
import { submitEnquiry, type ContactState } from '@/app/contact/actions';

const initial: ContactState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
    >
      {pending ? 'Sending…' : 'Send enquiry'}
    </button>
  );
}

export function ContactForm({ property }: { property?: string }) {
  const [state, formAction] = useActionState(submitEnquiry, initial);

  if (state.ok) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" aria-hidden />
        <h2 className="mt-3 text-lg font-semibold text-slate-900">Thank you</h2>
        <p className="mt-1 text-slate-600">
          Your enquiry has been received. Our team will be in touch shortly.
        </p>
      </div>
    );
  }

  const field =
    'w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800';

  return (
    <form action={formAction} className="space-y-4">
      {property && <input type="hidden" name="property" value={property} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-slate-700">Name</label>
          <input id="name" name="name" required className={`mt-1 ${field}`} />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone</label>
          <input id="phone" name="phone" type="tel" className={`mt-1 ${field}`} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
        <input id="email" name="email" type="email" className={`mt-1 ${field}`} />
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          defaultValue={property ? `I would like more information about "${property}".` : ''}
          className={`mt-1 ${field}`}
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
