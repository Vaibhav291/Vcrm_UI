import { useEffect, useState } from 'react'
import { customersApi } from '../../api/customers'
import { ApiError } from '../../api/client'
import type { Customer, CustomerInput } from '../../types/customer'
import { CustomerForm } from './CustomerForm'
import { useSession } from '../../auth/useSession'
import { clearSession } from '../../auth/session'

type Mode = { kind: 'list' } | { kind: 'create' } | { kind: 'edit'; customer: Customer }

export function CustomersPage() {
  const session = useSession()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>({ kind: 'list' })

  const loadCustomers = async () => {
    setLoading(true)
    setError(null)
    try {
      setCustomers(await customersApi.list())
    } catch (err) {
      setError(describeError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const handleCreate = async (input: CustomerInput) => {
    await customersApi.create(input)
    setMode({ kind: 'list' })
    await loadCustomers()
  }

  const handleUpdate = async (input: CustomerInput) => {
    if (mode.kind !== 'edit') return
    await customersApi.update(mode.customer.customerId, {
      ...input,
      customerId: mode.customer.customerId,
      createdAt: mode.customer.createdAt,
      updatedAt: mode.customer.updatedAt,
    })
    setMode({ kind: 'list' })
    await loadCustomers()
  }

  const handleDelete = async (customer: Customer) => {
    if (!confirm(`Delete ${customer.firstName} ${customer.lastName}?`)) return
    try {
      await customersApi.remove(customer.customerId)
      await loadCustomers()
    } catch (err) {
      setError(describeError(err))
    }
  }

  if (mode.kind === 'create') {
    return (
      <CustomerForm
        customer={null}
        onSubmit={handleCreate}
        onCancel={() => setMode({ kind: 'list' })}
      />
    )
  }

  if (mode.kind === 'edit') {
    return (
      <CustomerForm
        customer={mode.customer}
        onSubmit={handleUpdate}
        onCancel={() => setMode({ kind: 'list' })}
      />
    )
  }

  return (
    <div className="customers-page">
      <div className="page-header">
        <h1>Customers</h1>
        <div className="header-actions">
          {session && <span className="signed-in-as">Signed in as {session.username}</span>}
          <button className="btn-primary" onClick={() => setMode({ kind: 'create' })}>
            Add Customer
          </button>
          <button className="btn-secondary" onClick={clearSession}>
            Log out
          </button>
        </div>
      </div>

      {error && (
        <p className="form-error">
          {error} <button className="btn-link" onClick={loadCustomers}>Retry</button>
        </p>
      )}

      {loading ? (
        <p>Loading…</p>
      ) : customers.length === 0 ? (
        <p>No customers yet.</p>
      ) : (
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Industry</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customerId}>
                <td>{customer.firstName} {customer.lastName}</td>
                <td>{customer.companyName || '—'}</td>
                <td>{customer.email}</td>
                <td>{customer.phone || '—'}</td>
                <td>{customer.industry || '—'}</td>
                <td>
                  <span className={`status ${customer.isActive ? 'active' : 'inactive'}`}>
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="row-actions">
                  <button className="btn-link" onClick={() => setMode({ kind: 'edit', customer })}>
                    Edit
                  </button>
                  <button className="btn-link danger" onClick={() => handleDelete(customer)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function describeError(err: unknown): string {
  if (err instanceof ApiError) {
    return `Request failed (${err.status}): ${err.message}`
  }
  return err instanceof Error ? err.message : 'Unable to reach the API'
}
