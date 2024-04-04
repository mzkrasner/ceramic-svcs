import { CeramicClient } from "@ceramicnetwork/http-client";
import { ComposeClient } from "@composedb/client";
import { RuntimeCompositeDefinition } from "@composedb/types";
import { definition } from "./generated/definition";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { Wallet } from "ethers";
import { DIDSession } from "did-session";

async function main() {
  const ceramicClient = new CeramicClient("http://137.184.2.2:7007");
  const composeClient = new ComposeClient({
    ceramic: ceramicClient,
    definition: definition as RuntimeCompositeDefinition,
  });

  const wallet = Wallet.createRandom();
  const accountId = await getAccountId(
    wallet,
    wallet.address
  );
  const authMethod = await EthereumWebAuth.getAuthMethod(
    wallet,
    accountId
  );
  const session = await DIDSession.get(accountId, authMethod, {
    resources: composeClient.resources,
  });

  //@ts-ignore
  await ceramicClient.setDID(session.did);
  //@ts-ignore
  await composeClient.setDID(session.did);

  console.log("isAuth:", composeClient);
}

main().then(() => { })