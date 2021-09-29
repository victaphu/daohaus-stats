const fs = require("fs");
const yaml = require("js-yaml");

const config = {
  kovan: {
    v1FactoryAddress: "0x0C60Cd59f42093c7489BA68BAA4d7A01f2468153",
    v1FactoryStartBlock: 14980875,
    v2FactoryAddress: "0xB47778d3BcCBf5e39dEC075CA5F185fc20567b1e",
    v2FactoryStartBlock: 16845360,
    v21FactoryAddress: "0x9c5d087f912e7187D9c75e90999b03FB31Ee17f5",
    v21FactoryStartBlock: 22640938,
  },
  rinkeby: {
    v1FactoryAddress: "0x610247467d0dfA8B477ad7Dd1644e86CB2a79F8F",
    v1FactoryStartBlock: 6494343,
    v2FactoryAddress: "0x763b61A62EF076ad960E1d513713B2aeD7C1b88e",
    v2FactoryStartBlock: 6494329,
    v21FactoryAddress: "0xC33a4EfecB11D2cAD8E7d8d2a6b5E7FEacCC521d",
    v21FactoryStartBlock: 7771115,
  },
  xdai: {
    v1FactoryAddress: "0x9232DeA84E91b49feF6b604EEA0455692FC27Ba8",
    v1FactoryStartBlock: 10733005,
    v2FactoryAddress: "0x124F707B3675b5fdd6208F4483C5B6a0B9bAf316",
    v2FactoryStartBlock: 10733005,
    v21FactoryAddress: "0x0F50B2F3165db96614fbB6E4262716acc9F9e098",
    v21FactoryStartBlock: 13569775,
  },
  mainnet: {
    v1FactoryAddress: "0x2840d12d926cc686217bb42b80b662c7d72ee787",
    v1FactoryStartBlock: 8625240,
    v2FactoryAddress: "0x1782a13f176e84Be200842Ade79daAA0B09F0418",
    v2FactoryStartBlock: 9484660,
    v21FactoryAddress: "0x38064F40B20347d58b326E767791A6f79cdEddCe",
    v21FactoryStartBlock: 11499150,
  },
  matic: {
    v1FactoryAddress: "",
    v1FactoryStartBlock: "",
    v2FactoryAddress: "",
    v2FactoryStartBlock: "",
    v21FactoryAddress: "0x6690C139564144b27ebABA71F9126611a23A31C9",
    v21FactoryStartBlock: 10397177,
  },
  harmonyTest: {
    v1FactoryAddress: "0x10D52A3A9395650BeB6c4b6217A4E789A409C3C3",
    v1FactoryStartBlock: 15497036,
    v2FactoryAddress: "0x0000000000000000000000000000000000000000",
    v2FactoryStartBlock: 0,
    v21FactoryAddress: "0xFB6043369DB469E6F3998eA706DF80c9B9aB8De2",
    v21FactoryStartBlock: 15496997,
  },
};

const network = process.argv.slice(2)[0];

try {
  let fileContents = fs.readFileSync("./subgraph-template.yaml", "utf8");
  let data = yaml.safeLoad(fileContents);

  data.dataSources[0].network = network;
  data.dataSources[0].source.address = config[network].v1FactoryAddress;
  data.dataSources[0].source.startBlock = config[network].v1FactoryStartBlock;

  data.dataSources[1].network = network;
  data.dataSources[1].source.address = config[network].v2FactoryAddress;
  data.dataSources[1].source.startBlock = config[network].v2FactoryStartBlock;

  data.dataSources[2].network = network;
  data.dataSources[2].source.address = config[network].v21FactoryAddress;
  data.dataSources[2].source.startBlock = config[network].v21FactoryStartBlock;

  data.templates[0].network = network;
  data.templates[1].network = network;
  data.templates[2].network = network;

  if (network !== "mainnet") {
    data.dataSources.splice(3, 1);
  }

  if (network === "matic") {
    data.dataSources.splice(0, 2);
    data.templates.splice(0, 2);
  }

  let yamlStr = yaml.safeDump(data);
  fs.writeFileSync("subgraph.yaml", yamlStr, "utf8");

  console.log("Generated subgraph.yaml for " + network);
} catch (e) {
  console.log(e);
}
