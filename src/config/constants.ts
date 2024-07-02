import { Chain } from "./types";

export const Chains: { [key: string]: Chain } = {
  "neutron-1": {
    name: "neutron",
    prefix: "neutron",
    rpc: "https://rpc.novel.remedy.tm.p2p.org",
    channels: {
      "osmosis-1": "channel-10",
      "phoenix-1": "channel-25",
      "stargaze-1": "channel-18",
      "cosmoshub-4": "channel-1",
      "stride-1": "channel-8",
    },
  },
  "osmosis-1": {
    name: "osmosis",
    prefix: "osmo",
    rpc: "https://rpc.osmosis.zone",
    channels: {
      "neutron-1": "channel-874",
      "phoenix-1": "channel-251",
      "stargaze-1": "channel-75",
      "cosmoshub-4": "channel-0",
      "stride-1": "channel-326",
    },
  },
  "phoenix-1": {
    name: "terra",
    prefix: "terra",
    rpc: "https://terra-rpc.polkachu.com",
    channels: {
      "neutron-1": "channel-229",
      "osmosis-1": "channel-1",
      "stargaze-1": "channel-324",
      "cosmoshub-4": "channel-0",
      "stride-1": "channel-46",
    },
  },
  "stargaze-1": {
    name: "stargaze",
    prefix: "stars",
    rpc: "https://rpc.stargaze-apis.com",
    channels: {
      "neutron-1": "channel-191",
      "osmosis-1": "channel-0",
      "phoenix-1": "channel-266",
      "cosmoshub-4": "channel-239",
      "stride-1": "channel-106",
    },
  },
  "cosmoshub-4": {
    name: "cosmoshub",
    prefix: "cosmos",
    rpc: "https://cosmos-rpc.quickapi.com:443",
    channels: {
      "neutron-1": "channel-569",
      "osmosis-1": "channel-141",
      "phoenix-1": "channel-339",
      "stargaze-1": "channel-730",
      "stride-1": "channel-391",
    },
  },
  "stride-1": {
    name: "stride",
    prefix: "stride",
    rpc: "https://stride-rpc.polkachu.com",
    channels: {
      "neutron-1": "channel-123",
      "osmosis-1": "channel-5",
      "phoenix-1": "channel-52",
      "stargaze-1": "channel-19",
      "cosmoshub-4": "channel-0",
    },
  },
};
