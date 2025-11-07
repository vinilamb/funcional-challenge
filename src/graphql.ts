import { graphql, buildSchema } from "graphql";

export const schema = buildSchema(`
type Query {
    saldo(idConta: Int!): Float
    contas: [Conta]
}

type Conta {
    idConta: Int!
    saldo: Float!
}

type Mutation {
    sacar(idConta: Int!, valor: Float!): Conta
    depositar(idConta: Int!, valor: Float!): Conta
}
`);