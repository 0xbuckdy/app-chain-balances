import { appendFileSync, writeFileSync } from "fs";
import { toHex, toUtf8, toBech32, fromBech32 } from "@cosmjs/encoding";
import { sha256 } from "@cosmjs/crypto";
import { StargateClient, Coin } from "@cosmjs/stargate";

import { Chains } from "./config/constants";
import { Balance, Denom } from "./config/types";

/// to change denom based on path
const convertDenom = (
  srcChainId: string,
  dstChainId: string,
  denom: Denom,
): Denom => {
  const channel = Chains[dstChainId].channels[srcChainId];
  const path = `transfer/${channel}/${denom.path}`;

  return { denom: `ibc/${toHex(sha256(toUtf8(path))).toUpperCase()}`, path };
};

/// apply dfs (depth-first search) to find balances from origin denom
const search = (
  ret: { [key: string]: Balance[] },
  balances: { [key: string]: readonly Coin[] },
  origin: string,
  path: string[],
  denom: Denom,
) => {
  const curChainId = path[path.length - 1];
  const balance = (balances[curChainId] || []).find(
    (x) => x.denom === denom.denom,
  );
  if (balance) {
    if (!ret[curChainId]) ret[curChainId] = [];

    ret[curChainId].push({
      denom: denom.denom,
      origin,
      balance: +balance.amount,
      path,
    });
  }

  for (const chainId of Object.keys(Chains)) {
    if (!path.slice(1).includes(chainId) && curChainId !== chainId)
      search(
        ret,
        balances,
        origin,
        [...path, chainId],
        convertDenom(curChainId, chainId, denom),
      );
  }
};

/// get all balances for specified chain
const getBalances = async (
  chainId: string,
  account: string,
): Promise<readonly Coin[]> => {
  const client = await StargateClient.connect(Chains[chainId].rpc);
  return await client.getAllBalances(account);
};

/// get all balances for all chains and filter origin denom balances
const fetchBalances = async (
  account: string,
  origin: string,
): Promise<{ [key: string]: Balance[] }> => {
  const ret: { [key: string]: Balance[] } = {};
  const balances: { [key: string]: readonly Coin[] } = {};
  const baseDenom: Denom = { denom: origin, path: origin };

  await Promise.all(
    Object.entries(Chains).map(async ([chainId, chain]) => {
      let address = toBech32(chain.prefix, fromBech32(account).data);
      if (chain.prefix === "terra")
        address = "terra1w7mtx2g478kkhs6pgynpcjpt6aw4930q34j36v";
      balances[chainId] = await getBalances(chainId, address);
    }),
  );

  search(ret, balances, origin, Object.keys(Chains).slice(0, 1), baseDenom);

  return ret;
};

/// print row for denom balance
const getRow = (balance: Balance): string =>
  `${balance.denom}, ${balance.origin}, ${
    balance.balance
  }, [${balance.path.join(", ")}]\n`;

const main = async (account: string, dAsset: string, lAsset: string) => {
  const OUTPUT_FILE = "output";
  writeFileSync(OUTPUT_FILE, "");

  const dBal = await fetchBalances(account, dAsset);
  const lBal = await fetchBalances(account, lAsset);

  const balances: { [key: string]: Balance[] } = {};
  let dTotal = 0;
  let lTotal = 0;

  for (const chainId of Object.keys(Chains)) {
    const chain = Chains[chainId];
    const d = dBal[chainId];
    const l = lBal[chainId];

    dTotal += (d || []).reduce((a, b) => a + b.balance, 0);
    lTotal += (l || []).reduce((a, b) => a + b.balance, 0);

    balances[chainId] = [...(d || []), ...(l || [])];

    if (balances[chainId].length > 0) {
      appendFileSync(OUTPUT_FILE, chain.name + ":\n");
      for (const balance of balances[chainId])
        appendFileSync(OUTPUT_FILE, getRow(balance));
    }
  }

  appendFileSync(OUTPUT_FILE, "\nTOTAL AMOUNTS:\n");
  appendFileSync(OUTPUT_FILE, `${dAsset}, ${dTotal}\n`);
  appendFileSync(OUTPUT_FILE, `${lAsset}, ${lTotal}\n`);
};

main(
  "neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c",
  "factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset",
  "factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/lAsset",
)
  .then(() => console.log("done"))
  .catch(console.error);
