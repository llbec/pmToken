import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';
import { ContractTransaction } from 'ethers';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

export const getDb = () => low(new FileSync('./deployed-contracts.json'));

export let DRE: HardhatRuntimeEnvironment | BuidlerRuntimeEnvironment;

export const waitForTx = async (tx: ContractTransaction) => await tx.wait(1);

export const setDRE = (_DRE: HardhatRuntimeEnvironment | BuidlerRuntimeEnvironment) => {
    DRE = _DRE;
};

export const evmSnapshot = async () => await DRE.ethers.provider.send('evm_snapshot', []);

export const evmRevert = async (id: string) => DRE.ethers.provider.send('evm_revert', [id]);

export const getCurrentBlock = async () => {
    return DRE.ethers.provider.getBlockNumber();
  };