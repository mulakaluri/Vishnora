export async function loadGraphQLSchema(graphqlUrl) {
  const introspectionQuery = {
    query: `
      {
        __schema {
          queryType { name }
          mutationType { name }
          types {
            name
            kind
            fields { name }
          }
        }
      }
    `
  };
  const res = await fetch(graphqlUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(introspectionQuery),
    timeout: 15000,
  });
  if (!res.ok) throw new Error(`GraphQL introspection failed: ${res.status}`);
  return await res.json();
}

export function buildGraphQLTargets(schema) {
  const types = schema?.data?.__schema?.types || [];
  const queries = types.find(t => t.name === "Query")?.fields?.map(f => f.name) || [];
  const mutations = types.find(t => t.name === "Mutation")?.fields?.map(f => f.name) || [];
  return { queries, mutations };
}