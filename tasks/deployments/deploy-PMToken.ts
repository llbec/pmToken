import { task } from 'hardhat/config';
import { deployERC20 } from '../../helpers/contracts-deployments';

task('deploy-PMToken', 'Planet Mobius Token')
    .addFlag('verify', 'Verify DAO contracts via Etherscan API.')
    .setAction(async ({ verify }, hre) => {
        await hre.run('set-DRE');
        const pmToken = await deployERC20(verify);
        console.log('PM token contract deploy at ', pmToken.address);
    });