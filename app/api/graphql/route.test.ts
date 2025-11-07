import { POST } from './route';
import { executeGraphQL } from '@/lib/graphql';

// Mock the GraphQL utility
jest.mock('@/lib/graphql', () => ({
    executeGraphQL: jest.fn(),
}))

const mockedExecuteGraphQL = executeGraphQL as jest.MockedFunction<typeof executeGraphQL>;


describe('GraphQL API Route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should execute a GraphQL query', async () => {
        const mockedRequest = {
            json: jest.fn().mockResolvedValue({
                query: 'query { contas { numero saldo } }',
                variables: {},
            }),
        } as any;
    
        const mockGraphQLResult = {
            data: {
                contas: [
                    { numero: '123', saldo: 1000 },
                    { numero: '456', saldo: 2000 },
                ],
            },
        };

        mockedExecuteGraphQL.mockResolvedValue(mockGraphQLResult);

        const response = await POST(mockedRequest);
        const responseData = await response.json();

        expect(mockedRequest.json).toHaveBeenCalledTimes(1);
        expect(mockedExecuteGraphQL).toHaveBeenCalledWith('query { contas { numero saldo } }', {});

        expect(response.status).toBe(200);
        expect(responseData).toEqual(mockGraphQLResult);
    });

});
