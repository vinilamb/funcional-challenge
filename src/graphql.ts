import { graphql, buildSchema } from "graphql";
import client from "./mongodb.js";

const SCHEMA = buildSchema(`
type Query {
    saldo(numero: Int!): Float
    contas: [Conta]
}

type Conta {
    numero: Int!
    saldo: Float!
}

type Mutation {
    sacar(numero: Int!, valor: Float!): Conta
    depositar(numero: Int!, valor: Float!): Conta
}
`);

const CONTEXT = {
    contas() {
        return client.db('funcional').collection('contas').find({}).toArray()
    },

    saldo({ numero }) {
        return client.db('funcional').collection('contas').findOne({ numero }).then(conta => conta ? conta.saldo : null)
    },

    async sacar({ numero, valor }) {
        const conta = await client.db('funcional').collection('contas').findOne({ numero });
        if (!conta) throw new Error('Conta não encontrada');
        if (conta.saldo < valor) throw new Error('Saldo insuficiente');
        const novoSaldo = conta.saldo - valor;
        await client.db('funcional').collection('contas').updateOne({ numero }, { $set: { saldo: novoSaldo } });
        return { numero, saldo: novoSaldo };
    },

    async depositar({ numero, valor }) {
        const conta = await client.db('funcional').collection('contas').findOne({ numero });
        if (!conta) throw new Error('Conta não encontrada');
        const novoSaldo = conta.saldo + valor;
        await client.db('funcional').collection('contas').updateOne({ numero }, { $set: { saldo: novoSaldo } });
        return { numero, saldo: novoSaldo };
    }
}

export async function executeGraphQL(query: string, variables: any = {}) {
    return await graphql({
        schema: SCHEMA,
        source: query,
        variableValues: variables,
        rootValue: CONTEXT,
    });
}