import client from '@/lib/mongodb'
import { MongoClient } from 'mongodb'

// Mock everything
jest.mock('mongodb', () => ({
  MongoClient: jest.fn(() => ({
    connect: jest.fn(),
    close: jest.fn(),
  })),
}))

jest.mock('@vercel/functions', () => ({
  attachDatabasePool: jest.fn(),
}))

describe('MongoDB Client', () => {
  it('should export a client instance', () => {
    // This simple test will execute the module and give you coverage
    expect(client).toBeDefined()
  })

  it('should have been initialized with environment variable', () => {
    expect(MongoClient).toHaveBeenCalledWith(process.env.MONGODB_URI, {
      appName: "devrel.vercel.integration",
      maxIdleTimeMS: 5000
    })
  })
})