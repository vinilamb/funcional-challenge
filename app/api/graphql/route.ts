import { NextResponse } from 'next/server'
import { executeGraphQL } from '@/lib/graphql'

export async function POST(request: Request) {
  const { query, variables } = await request.json()
  const result = await executeGraphQL(query, variables)
  return NextResponse.json(result)
}