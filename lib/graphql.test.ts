import { executeGraphQL } from '@/lib/graphql'
import client from './mongodb'


// Mock the dependencies

var mockClient = {
  db: jest.fn(() => ({
    collection: jest.fn(() => ({
      find: jest.fn(() => ({
        toArray: jest.fn().mockResolvedValue([])
      })),
      findOne: jest.fn().mockResolvedValue({ numero: 1, saldo: 100 }),
      updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 })
    }))
  }))
}


jest.mock('@/lib/mongodb', () => ({ client: mockClient }))

const mockStaticData = {
  contas: [{ numero: 1, saldo: 100 }, { numero: 2, saldo: 200 }],
  saldo: 100,
  sacar: { numero: 1, saldo: 50 },
  depositar: { numero: 1, saldo: 150 }
}

describe('GraphQL Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return all contas', async () => {
    mockClient.db().collection().find().toArray.mockResolvedValue(mockStaticData.contas)

    const result = await executeGraphQL('query { contas { numero saldo } }')
    expect(result).toEqual(mockStaticData.contas)
  })

  it('should return saldo of a conta', async () => {
    mockClient.db().collection().findOne.mockResolvedValue({ numero: 1, saldo: mockStaticData.saldo })
    
    const result = await executeGraphQL('query { saldo(numero: 1) }')
    expect(result).toEqual({ saldo: mockStaticData.saldo })
  })

  it('should return perform deposito', async () => {
    const result = await executeGraphQL('mutation { deposito(numero: 1, valor: 50) }')
    expect(result).toBeDefined()
  })

  it('should return perform saque', async () => {
    const result = await executeGraphQL('mutation { saque(numero: 1, valor: 50) }')
    expect(result).toBeDefined()
  })
})