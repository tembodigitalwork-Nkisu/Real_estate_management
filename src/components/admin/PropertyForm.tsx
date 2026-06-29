'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { Property } from '@/lib/types';
import type { PropertyFormState } from '@/app/admin/(dashboard)/properties/actions';

type Action = (
  prev: PropertyFormState,
  formData: FormData,
) => Promise<PropertyFormState>;

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
    >
      {pending ? 'Saving…' : label}
    </button>
  );
}

const input =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800';
const label = 'text-sm font-medium text-slate-700';

export function PropertyForm({
  action,
  property,
  submitLabel,
}: {
  action: Action;
  property?: Property;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">Basics</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="title" className={label}>Title</label>
            <input id="title" name="title" required defaultValue={property?.title} className={input} />
          </div>
          <div>
            <label htmlFor="description" className={label}>Description</label>
            <textarea id="description" name="description" rows={4} defaultValue={property?.description ?? ''} className={input} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="property_type" className={label}>Type</label>
              <select id="property_type" name="property_type" defaultValue={property?.property_type ?? 'house'} className={input}>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Land</option>
                <option value="office">Office</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label htmlFor="listing_type" className={label}>Listing</label>
              <select id="listing_type" name="listing_type" defaultValue={property?.listing_type ?? 'sale'} className={input}>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className={label}>Status</label>
              <select id="status" name="status" defaultValue={property?.status ?? 'draft'} className={input}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">Pricing & details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="price" className={label}>Price</label>
            <input id="price" name="price" type="number" min="0" step="0.01" defaultValue={property?.price ?? ''} className={input} />
          </div>
          <div>
            <label htmlFor="currency" className={label}>Currency</label>
            <input id="currency" name="currency" defaultValue={property?.currency ?? 'ZMW'} className={input} />
          </div>
          <div>
            <label htmlFor="area_sqm" className={label}>Area (m²)</label>
            <input id="area_sqm" name="area_sqm" type="number" min="0" step="0.01" defaultValue={property?.area_sqm ?? ''} className={input} />
          </div>
          <div>
            <label htmlFor="bedrooms" className={label}>Bedrooms</label>
            <input id="bedrooms" name="bedrooms" type="number" min="0" defaultValue={property?.bedrooms ?? ''} className={input} />
          </div>
          <div>
            <label htmlFor="bathrooms" className={label}>Bathrooms</label>
            <input id="bathrooms" name="bathrooms" type="number" min="0" defaultValue={property?.bathrooms ?? ''} className={input} />
          </div>
          <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-slate-700">
            <input type="checkbox" name="featured" defaultChecked={property?.featured} className="h-4 w-4 rounded border-slate-300" />
            Featured
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">Location</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <label htmlFor="address" className={label}>Address</label>
            <input id="address" name="address" defaultValue={property?.address ?? ''} className={input} />
          </div>
          <div>
            <label htmlFor="city" className={label}>City</label>
            <input id="city" name="city" defaultValue={property?.city ?? ''} className={input} />
          </div>
          <div>
            <label htmlFor="province" className={label}>Province</label>
            <input id="province" name="province" defaultValue={property?.province ?? ''} className={input} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">Images</h2>
        <p className="mt-1 text-sm text-slate-500">
          Paste image URLs, one per line (or comma-separated). The first image is
          the cover.
        </p>
        <textarea
          name="images"
          rows={4}
          defaultValue={property?.images.join('\n') ?? ''}
          placeholder="https://…/photo-1.jpg"
          className={`${input} font-mono text-xs`}
        />
      </section>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div className="flex items-center gap-3">
        <SaveButton label={submitLabel} />
        <Link href="/admin/properties" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Cancel
        </Link>
      </div>
    </form>
  );
}
