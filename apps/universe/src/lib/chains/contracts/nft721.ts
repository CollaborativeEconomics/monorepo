import * as SorobanClient from 'soroban-client'
import invoke from './invoker'

export const Networks = {
  futurenet: {
    contractId: 'CDHGVKFRG7CFXVKTZGNM7VKEQWZDBLH733FD6AD3SN7JZIRZSHZM5Q2S',
    networkPassphrase: 'Test SDF Future Network ; October 2022',
    rpcUrl: 'https://rpc-futurenet.stellar.org:443'
  },
  testnet: {
    contractId: 'CDHGVKFRG7CFXVKTZGNM7VKEQWZDBLH733FD6AD3SN7JZIRZSHZM5Q2S',
    networkPassphrase: 'Test SDF Network ; September 2015',
    rpcUrl: 'https://soroban-testnet.stellar.org'
  }
};

export class Contract {
  options;
  spec;
  constructor(options:any) {
    this.options = options;
    this.spec = new SorobanClient.ContractSpec([
      "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAGc3ltYm9sAAAAAAAQAAAAAA==",
      "AAAAAAAAAAAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAA=",
      "AAAAAAAAAAAAAAAHYXBwcm92ZQAAAAACAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAA=",
      "AAAAAAAAAAAAAAAJdW5hcHByb3ZlAAAAAAAAAQAAAAAAAAAFb3duZXIAAAAAAAATAAAAAA==",
      "AAAAAAAAAAAAAAAEbWludAAAAAEAAAAAAAAAAnRvAAAAAAATAAAAAA==",
      "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAADAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAAAmlkAAAAAAALAAAAAA==",
      "AAAAAAAAAAAAAAANdHJhbnNmZXJfZnJvbQAAAAAAAAQAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAJpZAAAAAAACwAAAAA=",
      "AAAAAAAAAAAAAAAEYnVybgAAAAIAAAAAAAAABGZyb20AAAATAAAAAAAAAAJpZAAAAAAACwAAAAA=",
      "AAAAAAAAAAAAAAAJYnVybl9mcm9tAAAAAAAAAwAAAAAAAAAIb3BlcmF0b3IAAAATAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACaWQAAAAAAAsAAAAA",
      "AAAAAAAAAAAAAAAFYWRtaW4AAAAAAAAAAAAAAQAAABM=",
      "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAJpZAAAAAAAEwAAAAEAAAAL",
      "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==",
      "AAAAAAAAAAAAAAAIb3BlcmF0b3IAAAABAAAAAAAAAAVvd25lcgAAAAAAABMAAAABAAAAEw==",
      "AAAAAAAAAAAAAAAFb3duZXIAAAAAAAABAAAAAAAAAAJpZAAAAAAACwAAAAEAAAAT",
      "AAAAAAAAAAAAAAAGc3VwcGx5AAAAAAAAAAAAAQAAAAs=",
      "AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAABA=",
      "AAAAAAAAAAAAAAAJdG9rZW5fdXJpAAAAAAAAAAAAAAEAAAAQ",
      "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACQAAAAAAAAAAAAAABUFkbWluAAAAAAAAAQAAAAAAAAAHQmFsYW5jZQAAAAABAAAAEwAAAAAAAAAAAAAABE5hbWUAAAABAAAAAAAAAAVOb25jZQAAAAAAAAEAAAATAAAAAQAAAAAAAAAFT3duZXIAAAAAAAABAAAACwAAAAEAAAAAAAAACE9wZXJhdG9yAAAAAQAAABMAAAABAAAAAAAAAAVTdGF0ZQAAAAAAAAEAAAATAAAAAAAAAAAAAAAGU3VwcGx5AAAAAAAAAAAAAAAAAAZTeW1ib2wAAA=="
    ]);
  }
  async initialize({ admin, name, symbol }:any, options = {}) {
    const res = await invoke({
      method: 'initialize',
      args: this.spec.funcArgsToScVals("initialize", { admin, name, symbol }),
      ...options,
      ...this.options,
      parseResultXdr: () => { },
    });
    return res
  }
  async setAdmin({ new_admin }:any, options = {}) {
    const res = await invoke({
      method: 'set_admin',
      args: this.spec.funcArgsToScVals("set_admin", { new_admin }),
      ...options,
      ...this.options,
      parseResultXdr: () => { },
    });
    return res
  }
  async approve({ owner, operator }:any, options = {}) {
    const res = await invoke({
      method: 'approve',
      args: this.spec.funcArgsToScVals("approve", { owner, operator }),
      ...options,
      ...this.options,
      parseResultXdr: () => { },
    });
    return res
  }
  async unapprove({ owner }:any, options = {}) {
    const res = await invoke({
      method: 'unapprove',
      args: this.spec.funcArgsToScVals("unapprove", { owner }),
      ...options,
      ...this.options,
      parseResultXdr: () => { },
    });
    return res
  }
  async mint({ to }:any, options = {}) {
    const res = await invoke({
      method: 'mint',
      args: this.spec.funcArgsToScVals("mint", { to }),
      ...options,
      ...this.options,
      parseResultXdr: () => { },
    });
    return res
  }
  async transfer({ from, to, id }:any, options = {}) {
    const res = await invoke({
      method: 'transfer',
      args: this.spec.funcArgsToScVals("transfer", { from, to, id }),
      ...options,
      ...this.options,
      parseResultXdr: () => { },
    });
    return res
  }
  async transferFrom({ operator, from, to, id }:any, options = {}) {
    const res = await invoke({
      method: 'transfer_from',
      args: this.spec.funcArgsToScVals("transfer_from", { operator, from, to, id }),
      ...options,
      ...this.options,
      parseResultXdr: () => { },
    });
    return res
  }
  async burn({ from, id }:any, options = {}) {
    const res = await invoke({
      method: 'burn',
      args: this.spec.funcArgsToScVals("burn", { from, id }),
      ...options,
      ...this.options,
      parseResultXdr: () => { },
    });
    return res
  }
  async burnFrom({ operator, from, id }:any, options = {}) {
    const res = await invoke({
      method: 'burn_from',
      args: this.spec.funcArgsToScVals("burn_from", { operator, from, id }),
      ...options,
      ...this.options,
      parseResultXdr: () => { },
    });
    return res
  }
  async admin(options = {}) {
    const res = await invoke({
      method: 'admin',
      args: this.spec.funcArgsToScVals("admin", {}),
      ...options,
      ...this.options,
      parseResultXdr: (xdr:any) => {
        return this.spec.funcResToNative("admin", xdr);
      },
    });
    return res
  }
  async balance({ id }:any, options = {}) {
    const res = await invoke({
      method: 'balance',
      args: this.spec.funcArgsToScVals("balance", { id }),
      ...options,
      ...this.options,
      parseResultXdr: (xdr:any) => {
        return this.spec.funcResToNative("balance", xdr);
      },
    });
    return res
  }
  async name(options = {}) {
    const res = await invoke({
      method: 'name',
      args: this.spec.funcArgsToScVals("name", {}),
      ...options,
      ...this.options,
      parseResultXdr: (xdr:any) => {
        return this.spec.funcResToNative("name", xdr);
      },
    });
    return res
  }
  async operator({ owner }:any, options = {}) {
    const res = await invoke({
      method: 'operator',
      args: this.spec.funcArgsToScVals("operator", { owner }),
      ...options,
      ...this.options,
      parseResultXdr: (xdr:any) => {
        return this.spec.funcResToNative("operator", xdr);
      },
    });
    return res
  }
  async owner({ id }:any, options = {}) {
    const res = await invoke({
      method: 'owner',
      args: this.spec.funcArgsToScVals("owner", { id }),
      ...options,
      ...this.options,
      parseResultXdr: (xdr:any) => {
        return this.spec.funcResToNative("owner", xdr);
      },
    });
    return res
  }
  async supply(options = {}) {
    const res = await invoke({
      method: 'supply',
      args: this.spec.funcArgsToScVals("supply", {}),
      ...options,
      ...this.options,
      parseResultXdr: (xdr:any) => {
        return this.spec.funcResToNative("supply", xdr);
      },
    });
    return res
  }
  async symbol(options = {}) {
    const res = await invoke({
      method: 'symbol',
      args: this.spec.funcArgsToScVals("symbol", {}),
      ...options,
      ...this.options,
      parseResultXdr: (xdr:any) => {
        return this.spec.funcResToNative("symbol", xdr);
      },
    });
    return res
  }
  async tokenUri(options = {}) {
    const res = await invoke({
      method: 'token_uri',
      args: this.spec.funcArgsToScVals("token_uri", {}),
      ...options,
      ...this.options,
      parseResultXdr: (xdr:any) => {
        return this.spec.funcResToNative("token_uri", xdr);
      },
    });
    return res
  }
}

