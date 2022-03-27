import { evmRevert, evmSnapshot } from '../../helpers/utils';
import {Signer} from 'ethers';
import {
    getEthersSigners,
    tEthereumAddress,
} from '../../helpers/contracts-helpers';
import {
    getERC20,
} from '../../helpers/contracts-deployments';
import {
    ERC20
} from '../../typechain';

export interface SignerWithAddress {
    signer: Signer;
    address: tEthereumAddress;
}

export interface TestEnv {
    deployer: SignerWithAddress;
    users: SignerWithAddress[];
    pmToken: ERC20;
}

const testEnv: TestEnv = {
    deployer: {} as SignerWithAddress,
    users: [] as SignerWithAddress[],
    pmToken: {} as ERC20
} as TestEnv;

export async function initializeMakeSuite() {
    const [_deployer, ...restSigners] = await getEthersSigners();
    const deployer: SignerWithAddress = {
        address: await _deployer.getAddress(),
        signer: _deployer,
    };
    for (const signer of restSigners) {
        testEnv.users.push({
            signer,
            address: await signer.getAddress(),
        });
    }
    testEnv.deployer = deployer;
    testEnv.pmToken = await getERC20();
}

let buidlerevmSnapshotId: string = '0x1';
const setBuidlerevmSnapshotId = (id: string) => {
    buidlerevmSnapshotId = id;
};

const setSnapshot = async () => {
    setBuidlerevmSnapshotId(await evmSnapshot());
};

const revertHead = async () => {
    await evmRevert(buidlerevmSnapshotId);
};

export function makeSuite(name: string, tests: (testEnv: TestEnv) => void) {
    describe(name, () => {
        before(async () => {
            await setSnapshot();
        });
        tests(testEnv);
        after(async () => {
            await revertHead();
        });
    });
}