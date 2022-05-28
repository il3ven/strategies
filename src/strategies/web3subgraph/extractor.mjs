// @format
const version = "0.0.1";
export const name = "web3subgraph";

function generate(first, lastId) {
  return {
    type: "graphql",
    commissioner: name,
    version,
    options: {
      url: "https://api.thegraph.com/subgraphs/name/timdaub/web3musicsubgraph",
      body: JSON.stringify({
        query: `
          query manyNFTs($lastId: String) {
            nfts(first: ${first}, where: { id_gt: $lastId }) {
              id
            }
            _meta {
              block {
                number
              }
            }
          }`,
        variables: { lastId },
      }),
    },
    results: null,
    error: null,
  };
}

export const props = {
  autoStart: true,
  first: 1000,
  lastId: "",
};

export function init() {
  return {
    messages: [generate(props.first, props.lastId)],
    write: null,
  };
}

export function update(message) {
  const { nfts } = message.results.data;

  let messages = [];
  let write = null;
  if (nfts.length) {
    const lastId = nfts[nfts.length - 1].id;
    messages = [generate(props.first, lastId)];
    write = JSON.stringify(message.results.data);
  } else {
    messages = [
      {
        type: "transformation",
        version: "0.0.1",
        name,
        args: null,
      },
    ];
  }
  return {
    messages,
    write,
  };
}
