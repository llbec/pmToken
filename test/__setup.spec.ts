import rawBRE from 'hardhat';
import {Signer} from 'ethers';
import {
    deployERC20,
    setTeamAddress,
    setT2Address,
    setFdtAddress,
    setLeftAddress,
    setBlockCount,
    setADTimes
} from '../helpers/contracts-deployments';
import { getEthersSigners, getEthersSignersAddresses } from '../helpers/contracts-helpers';
import { initializeMakeSuite } from './helpers/make-suite';

const buildTestEnv = async (
    deployer: Signer,
    secondaryWallet: Signer
) => {
    const verify = false;
    const addrs = await getEthersSignersAddresses();
    setTeamAddress(addrs[1]);
    setT2Address(addrs[2]);
    setFdtAddress(addrs[3]);
    setLeftAddress(addrs[4]);
    setBlockCount("5");
    setADTimes("5");
    console.time('setup');
    console.log('ERC20 token deployed at ', (await deployERC20(verify)).address);
    console.timeEnd('setup');
};

before(async () => {
    await rawBRE.run('set-DRE');
    const [deployer, secondaryWallet] = await getEthersSigners();
    console.log('-> Deploying test environment...');
    await buildTestEnv(deployer, secondaryWallet);
    await initializeMakeSuite();
    console.log('\n***************');
    console.log('Setup and snapshot finished');
    console.log('***************\n');
});