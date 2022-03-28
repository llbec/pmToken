import { expect } from 'chai';
import { makeSuite, TestEnv } from './helpers/make-suite';
import { waitForTx } from '../helpers/utils';
import {
    TEAMADDRESS,
    T2ADDRESS,
    FOUNDATION,
    LEFTADDRESS,
    BLOCKCOUNTER,
    AIRDROPTIMES
} from '../helpers/contracts-deployments';
import { DRE, getCurrentBlock } from '../helpers/utils';

makeSuite('PM Token', (testEnv: TestEnv) => {
    it('init', async () => {
        const {deployer, pmToken} = testEnv;
        expect(await pmToken.symbol()).to.be.equal("PM", "token symbol invalid");
        expect(await pmToken.name()).to.be.equal("Planet Mobius", "token name invalid");
        expect(await pmToken.adLeft()).to.be.equal(AIRDROPTIMES);
        expect(await pmToken.balanceOf(TEAMADDRESS)).to.be.equal(0);
        expect(await pmToken.balanceOf(T2ADDRESS)).to.be.equal(0);
        expect(await pmToken.balanceOf(FOUNDATION)).to.be.equal("10000000000000000000000000");
        expect(await pmToken.balanceOf(LEFTADDRESS)).to.be.equal("18000000000000000000000000");
    });

    it('lock release', async () => {
        const {users, pmToken} = testEnv;
        let start = 1;
        const blockCounter = 5;
        const t1Total = "19999999999999999999999980";
        const t2Total = "49999999999999999999999920";
        expect(await pmToken.unlockHeight()).to.be.equal(start);
        expect(BLOCKCOUNTER).to.be.equal(blockCounter.toString());
        let height = await getCurrentBlock();
        for (let index = 1; index <= 121; index++) {
            while(height <= (index * blockCounter + start)) {
                if (height == 170) {
                    await pmToken.connect(users[0].signer).transfer(users[4].address, await pmToken.balanceOf(users[0].address));
                } else if (height == 360) {
                    await pmToken.connect(users[1].signer).transfer(users[5].address, await pmToken.balanceOf(users[1].address));
                } else {
                    await DRE.ethers.provider.send('evm_mine', []);
                }
                height = await getCurrentBlock();
            }
        }
        await pmToken.connect(users[0].signer).transfer(users[4].address, await pmToken.balanceOf(users[0].address));
        await pmToken.connect(users[1].signer).transfer(users[5].address, await pmToken.balanceOf(users[1].address));
        expect(await pmToken.balanceOf(users[4].address)).to.be.equal(t1Total);
        expect(await pmToken.balanceOf(users[5].address)).to.be.equal(t2Total);
    });

    it('airdrop', async () => {
        const {deployer, pmToken, users} = testEnv;
        for(let index = 6; index < 11; index++) {
            expect(await pmToken.balanceOf(users[index].address)).to.be.equal("0");
            waitForTx(await pmToken.connect(users[index].signer).airdrop());
            expect(await pmToken.adLeft()).to.be.equal(10 - index);
            expect(await pmToken.balanceOf(users[index].address)).to.be.equal("100000000000000000000");
            await expect(pmToken.connect(users[index].signer).airdrop()).to.be.revertedWith("airdrop completed");
        }
        await expect(pmToken.airdrop()).to.be.revertedWith("airdrop completed");
        expect(await pmToken.adLeft()).to.be.equal(0);
    });
})