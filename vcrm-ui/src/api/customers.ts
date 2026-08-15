import { apiClient } from './client'
import type { Customer, CustomerInput } from '../types/customer'

export const customersApi = {
  list: () => apiClient.get<Customer[]>('/Customers'),
  get: (id: number) => apiClient.get<Customer>(`/Customers/${id}`),
  create: (customer: CustomerInput) => apiClient.post<Customer>('/Customers', customer),
  update: (id: number, customer: Customer) =>
    apiClient.put<void>(`/Customers/${id}`, customer),
  remove: (id: number) => apiClient.delete(`/Customers/${id}`),
}
