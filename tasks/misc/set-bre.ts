import { task } from 'hardhat/config';
import { DRE, setDRE } from '../../helpers/utils';

task(`set-DRE`, `Inits the DRE, to have access to all the plugins' objects`)
    .setAction(async (_, hre) => {
        if (DRE) {
            return;
        }
        console.log('  - Network :', hre.network.name);
        setDRE(hre);
        return hre;
    })