export type Chain = {
  name: string;
  prefix: string;
  rpc: string;
  channels: {
    [key: string]: string;
  };
};

export type Denom = {
  denom: string;
  path: string;
};

export type Balance = {
  denom: string;
  origin: string;
  balance: number;
  path: string[];
};
