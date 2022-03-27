// contracts/Token.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library PlanetMobius {
    using PlanetMobius for PlanetMobius.State;

    // ========= Structs =========
    struct State {
        address lock1;
        address lock2;
        
        uint256 cycle1;
        uint256 cycle2;
        uint256 peroid;
        
        uint256 share1;
        uint256 share2;
        uint256 sFoundation;
        uint256 sLeft;

        uint256 adropRound;
        uint256 sAirdrop;
        uint256 airdroped;

        uint256 withdraw1;
        uint256 withdraw2;
        uint256 start;
        mapping (address => uint256) airdropState;
    }

    // ========= Views =========
    function pmTimes(PlanetMobius.State storage state) internal view returns (uint256) {
        return (block.number - state.start) / state.peroid;
    }

    function pmBalance(PlanetMobius.State storage state, address usr) internal view returns (uint256) {
        if (usr == state.lock1) {
            uint256 end = state.pmTimes();
            if (end > state.cycle1) {
                end = state.cycle1;
            }
            return (state.share1 / state.cycle1) * end - state.withdraw1;
        }
        if (usr == state.lock2) {
            uint256 end = state.pmTimes();
            if (end > state.cycle2) {
                end = state.cycle2;
            }
            return (state.share2 / state.cycle2) * end - state.withdraw2;
        }
        return 0;
    }

    function airdropLeft(PlanetMobius.State storage state) internal view returns (uint256) {
        return state.adropRound - state.airdroped;
    }

    // ========= Functions =========
    function airdrop(PlanetMobius.State storage state, address to) internal returns(uint256) {
        uint256 cur = state.airdropState[to];
        if (cur == 0 && state.adropRound > state.airdroped) {
            state.airdropState[to] = 1;
            state.airdroped += 1;
            return 100*1e18;
        }
        return 0;
    }

    function withdraw(PlanetMobius.State storage state, address to) internal {
        if (to == state.lock1) {
            state.withdraw1 += state.pmBalance(to);
        }
        if (to == state.lock2) {
            state.withdraw2 += state.pmBalance(to);
        }
    }

    function init(PlanetMobius.State storage state, address a1, address a2, uint256 peroid, uint256 round) internal {
        state.start = block.number;

        state.lock1 = a1;
        state.cycle1 = 60;
        state.share1 = 20000000*1e18;

        state.lock2 = a2;
        state.cycle2 = 120;
        state.share2 = 50000000*1e18;

        state.peroid = peroid;
        state.adropRound = round;

        state.sAirdrop = 100*1e18 * round;
        state.sLeft = 18000000*1e18;
        state.sFoundation = 10000000*1e18;
    }
}