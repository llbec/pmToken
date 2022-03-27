import { expect } from 'chai';
import { makeSuite, TestEnv } from './helpers/make-suite';
import { waitForTx } from '../helpers/utils';
import { connectERC20, getArgs } from '../helpers/contracts-deployments';
import { getEthersSigners, getEthersSignersAddresses } from '../helpers/contracts-helpers';

makeSuite('PM Token', (testEnv: TestEnv) => {
    it('init', async () => {
        const {deployer, pmToken} = testEnv;
        const args = await getArgs();
        expect(await pmToken.symbol()).to.be.equal("PM");
        expect(await pmToken.name()).to.be.equal("Planet Mobius");
        expect(await pmToken.adLeft()).to.be.equal(args[5]);
        expect(await pmToken.balanceOf(args[0])).to.be.equal(0);
        expect(await pmToken.balanceOf(args[1])).to.be.equal(0);
        expect(await pmToken.balanceOf(args[2])).to.be.equal("10000000000000000000000000");
        expect(await pmToken.balanceOf(args[3])).to.be.equal("18000000000000000000000000");
    });

    it('lock release', async () => {
        const {deployer, pmToken} = testEnv;
        const args = await getArgs();
        expect(await pmToken.balanceOf(args[0])).to.be.equal(0);
        expect(await pmToken.balanceOf(args[1])).to.be.equal(0);
    });

    it('airdrop', async () => {
        const {deployer, pmToken} = testEnv;
        const args = await getArgs();
        expect(await pmToken.adLeft()).to.be.equal(args[5]);
        const amount0 = await pmToken.balanceOf(deployer.address);
        waitForTx(await pmToken.airdrop());
        const amount1 = await pmToken.balanceOf(deployer.address);
        //expect(amount1.minus(amount0)).to.be.equal("100000000000000000000");
        console.log(amount0, amount1);
    });
})