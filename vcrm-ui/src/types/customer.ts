export interface Customer {
  customerId: number
  firstName: string
  lastName: string
  companyName: string | null
  email: string
  phone: string | null
  industry: string | null
  address: string | null
  assignedToUserId: number | null
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export type CustomerInput = Omit<Customer, 'customerId' | 'createdAt' | 'updatedAt'>
