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

const TEAMADDRESS = process.env.team !== undefined ? process.env.team : "";
const T2ADDRESS = process.env.t2 !== undefined ? process.env.t2 : "";
const FOUNDATION = process.env.foundation !== undefined ? process.env.foundation : "";
const LEFTADDRESS = process.env.others !== undefined ? process.env.others : "";
const BLOCKCOUNTER = process.env.blocks !== undefined ? process.env.blocks : "864000";
const AIRDROPTIMES = process.env.airdrop !== undefined ? process.env.airdrop : "20000";

export const getArgs = async() : Promise<string[]> => {
    let t1 = TEAMADDRESS;
    if (TEAMADDRESS === "") {
        t1 = (await getEthersSignersAddresses())[1];
    }
    let t2 = T2ADDRESS;
    if (T2ADDRESS === "") {
        t2 = (await getEthersSignersAddresses())[2];
    }
    let fAddr = FOUNDATION;
    if (FOUNDATION === "") {
        fAddr = (await getEthersSignersAddresses())[3];
    }
    let lAddr = LEFTADDRESS;
    if (LEFTADDRESS === "") {
        lAddr = (await getEthersSignersAddresses())[4];
    }
    return [t1, t2, fAddr, lAddr, BLOCKCOUNTER, AIRDROPTIMES];
}

export const deployERC20 = async (verify?: boolean) => {
    const id = eContractid.PMTOKEN;
    const args: string[] = await getArgs();
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

export const connectERC20 = async (
    usr: Signer,
    address?: tEthereumAddress
) : Promise<ERC20> => {
    return ERC20__factory.connect(
        address ||
        (await getDb().get(`${eContractid.PMTOKEN}.${DRE.network.name}`).value()).address,
        usr
    );
}