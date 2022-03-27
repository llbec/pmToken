import rawBRE from 'hardhat';
import {Signer} from 'ethers';
import {
    deployERC20
} from '../helpers/contracts-deployments';
import { getEthersSigners } from '../helpers/contracts-helpers';
import { initializeMakeSuite } from './helpers/make-suite';

const buildTestEnv = async (
    deployer: Signer,
    secondaryWallet: Signer
) => {
    const verify = false;
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