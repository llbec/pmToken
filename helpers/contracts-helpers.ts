import { Contract, Signer, utils, ContractFactory } from 'ethers';
import { getDb, waitForTx, DRE } from './utils';
import { verifyEtherscanContract } from './etherscan-verification';

export enum eContractid {
    PMTOKEN = 'ERC20',
}

export type tEthereumAddress = string;

export const registerContractInJsonDb = async (contractId: string, contractInstance: Contract) => {
    const currentNetwork = DRE.network.name;
    const FORK = process.env.FORK;
    if (FORK || (currentNetwork !== 'hardhat' && !currentNetwork.includes('coverage'))) {
        console.log(`*** ${contractId} ***\n`);
        console.log(`Network: ${currentNetwork}`);
        console.log(`tx: ${contractInstance.deployTransaction.hash}`);
        console.log(`contract address: ${contractInstance.address}`);
        console.log(`deployer address: ${contractInstance.deployTransaction.from}`);
        console.log(`gas price: ${contractInstance.deployTransaction.gasPrice}`);
        console.log(`gas used: ${contractInstance.deployTransaction.gasLimit}`);
        console.log(`\n******`);
        console.log();
    }

    await getDb()
        .set(`${contractId}.${currentNetwork}`, {
            address: contractInstance.address,
            deployer: contractInstance.deployTransaction.from,
        })
        .write();
};

export const getEthersSigners = async (): Promise<Signer[]> => {
    const ethersSigners = await Promise.all(await DRE.ethers.getSigners());
    return ethersSigners;
};

export const getEthersSignersAddresses = async (): Promise<tEthereumAddress[]> =>
    await Promise.all((await getEthersSigners()).map((signer) => signer.getAddress()));

export const deployContract = async <ContractType extends Contract>(
    contractName: string,
    args: any[]
): Promise<ContractType> => {
    const contract = (await (await DRE.ethers.getContractFactory(contractName))
        .connect((await getEthersSigners())[0])
        .deploy(...args)) as ContractType;
    await waitForTx(contract.deployTransaction);
    await registerContractInJsonDb(<eContractid>contractName, contract);
    return contract;
};

export const verifyContract = async (
    id: string,
    instance: Contract,
    args: (string | string[])[]
) => {
    await verifyEtherscanContract(instance.address, args);
    return instance;
};