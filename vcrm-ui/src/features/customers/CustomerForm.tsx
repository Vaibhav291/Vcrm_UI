import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Customer, CustomerInput } from '../../types/customer'

const emptyForm: CustomerInput = {
  firstName: '',
  lastName: '',
  companyName: '',
  email: '',
  phone: '',
  industry: '',
  address: '',
  assignedToUserId: null,
  isActive: true,
}

interface CustomerFormProps {
  customer: Customer | null
  onSubmit: (input: CustomerInput) => Promise<void>
  onCancel: () => void
}

function toFormState(customer: Customer | null ): CustomerInput {
  if (!customer) return emptyForm
  const { customerId: _customerId, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = customer
  return rest
}

export function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const [form, setForm] = useState<CustomerInput>(() => toFormState(customer))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: keyof CustomerInput, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <h2>{customer ? 'Edit Customer' : 'New Customer'}</h2>

      <div className="form-grid">
        <label>
          First name *
          <input
            required
            maxLength={50}
            value={form.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
        </label>
        <label>
          Last name *
          <input
            required
            maxLength={50}
            value={form.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </label>
        <label>
          Email *
          <input
            required
            type="email"
            maxLength={150}
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </label>
        <label>
          Phone
          <input
            maxLength={20}
            value={form.phone ?? ''}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </label>
        <label>
          Company
          <input
            maxLength={100}
            value={form.companyName ?? ''}
            onChange={(e) => handleChange('companyName', e.target.value)}
          />
        </label>
        <label>
          Industry
          <input
            maxLength={100}
            value={form.industry ?? ''}
            onChange={(e) => handleChange('industry', e.target.value)}
          />
        </label>
        <label className="span-2">
          Address
          <input
            maxLength={250}
            value={form.address ?? ''}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
          />
          Active
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}
