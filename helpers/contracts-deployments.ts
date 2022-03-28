import { getDb, DRE } from './utils';
import { Signer } from 'ethers';
import { ERC20, ERC20__factory } from '../typechain';
import {
    deployContract,
    verifyContract,
    eContractid,
    tEthereumAddress,
    getEthersSigners,
    getEthersSignersAddresses
} from './contracts-helpers';

export let TEAMADDRESS = process.env.team !== undefined ? process.env.team : "";
export let T2ADDRESS = process.env.t2 !== undefined ? process.env.t2 : "";
export let FOUNDATION = process.env.foundation !== undefined ? process.env.foundation : "";
export let LEFTADDRESS = process.env.others !== undefined ? process.env.others : "";
export let BLOCKCOUNTER = process.env.blocks !== undefined ? process.env.blocks : "864000";
export let AIRDROPTIMES = process.env.airdrop !== undefined ? process.env.airdrop : "20000";

export const setTeamAddress = (addr: string) => {
    TEAMADDRESS = addr;
}

export const setT2Address = (addr: string) => {
    T2ADDRESS = addr;
}

export const setFdtAddress = (addr: string) => {
    FOUNDATION = addr;
}

export const setLeftAddress = (addr: string) => {
    LEFTADDRESS = addr;
}

export const setBlockCount = (v: string) => {
    BLOCKCOUNTER = v;
}

export const setADTimes = (v: string) => {
    AIRDROPTIMES = v;
}

export const deployERC20 = async (verify?: boolean) => {
    const id = eContractid.PMTOKEN;
    const args: string[] = [TEAMADDRESS, T2ADDRESS, FOUNDATION, LEFTADDRESS, BLOCKCOUNTER, AIRDROPTIMES];
    console.log("erc20 args: ", args);
    const instance = await deployContract<ERC20>(id, args);
    await instance.deployTransaction.wait();
    if (verify) {
        await verifyContract(id, instance, args);
    }
    return instance;
}

export const hasERC20 = async () : Promise<boolean> => {
    return getDb().get(`${eContractid.PMTOKEN}.${DRE.network.name}`).value() != undefined;
}

export const getERC20 = async (
    address?: tEthereumAddress
) : Promise<ERC20> => {
    return ERC20__factory.connect(
        address ||
        (await getDb().get(`${eContractid.PMTOKEN}.${DRE.network.name}`).value()).address,
        (await getEthersSigners())[0]
    );
}