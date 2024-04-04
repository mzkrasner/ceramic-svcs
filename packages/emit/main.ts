import { CeramicClient } from "@ceramicnetwork/http-client";
import { ComposeClient } from "@composedb/client";
import { RuntimeCompositeDefinition } from "@composedb/types";
import { definition } from "./generated/definition.js";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { DID } from "dids";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { Wallet } from "ethers";
import { DIDSession } from "did-session";

async function main() {
  const ceramicClient = new CeramicClient("http://137.184.2.2:7007");
  const composeClient = new ComposeClient({
    ceramic: ceramicClient,
    definition: definition as RuntimeCompositeDefinition,
  });

  // Authenticate with Key DID
  let seed_array: Uint8Array;
  let seed = crypto.getRandomValues(new Uint8Array(32));
  seed_array = seed;

  const provider = new Ed25519Provider(seed_array);
  const did = new DID({ provider, resolver: getResolver() });
  await did.authenticate();
  console.log("DID:", did.id);

  ceramicClient.did = did;
  composeClient.setDID(did);

  // //@ts-ignore
  // await ceramicClient.setDID(did);
  // //@ts-ignore
  // await composeClient.setDID(session.did);

  console.log("isAuth:", composeClient);
}

main().then(() => {});
