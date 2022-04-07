import Vue from 'vue';
import Vuex from 'vuex';
import usdc from "../contract/usdc.json";
import vref from "../contract/vref.json";
import chains from '../constants/constantNetwork';
const contracts = { usdc, vref };

Vue.use(Vuex)

function initState() {
  let chainNames = Object.keys(chains);
  let supportedNetworks = {};
  for ( let chain of chainNames ) {
    if ( contracts.vref.address[chain] )
      supportedNetworks[chain] = {
        symbol: chain,
        ...chains[chain]
      };
  }
  return {
    chainId: 0,
    history: [],
    selectedTx: -1,
    supportedNetworks,
    accounts: [],
    coins: ["usdc", "vref"],
    balance: {},
    values: [0, 0],
    slippage: 0.2,
    tokenInPool: 0,
    moneyInPool: 0
  }
}

export default new Vuex.Store({
  state: initState(),
  mutations: {
    setChainId(state, id) {
      state.chainId = id;
    },
    setHistory(state, history) {
      state.history = history;
    },
    setSelectedTx(state, tx) {
      state.selectedTx = tx;
    },
    setAccounts(state, accounts) {
      if ( accounts && accounts.length )
        state.accounts = accounts;
    },
    setValues(state, values) {
      state.values = values
    },
    setPoolState(state, poolState) {
      state.tokenInPool = poolState.tokenInPool;
      state.moneyInPool = poolState.moneyInPool;
    },
    setBalance(state, balance) {
      state.balance = balance;
    }
  },
  actions: {
  },
  getters: {
    getABI: state => id => {
      let chain = Object.values(state.supportedNetworks).find(c => c.id==state.chainId);
      if ( !chain ) return null;
      return {
        address: contracts[id].address[chain.symbol],
        symbol: contracts[id].symbol,
        decimals: contracts[id].decimals,
        image: contracts[id].image || '',
        abi: contracts[id].abi
      }
    },
    history: state => state.history,
    selectedTx: state => state.selectedTx,
    supportedNetworks: state => state.supportedNetworks,
    chainId: state => state.chainId,
    chainName: state => Object.keys(chains).find(name => chains[name].id==state.chainId),
    isConnected: state => {
      const cachedProviderName = JSON.parse(localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER"));
      return state.accounts && state.accounts.length && cachedProviderName;
    },
    accounts: state => state.accounts,
    coins: state => state.coins,
    values: state => state.values,
    slippage: state => state.slippage,
    slippageReceived: state => parseInt((state.values[1] * (1-state.slippage/100))*100)/100,
    currentPrice: state => state.tokenInPool ? parseInt(state.moneyInPool*100/state.tokenInPool)/100 : 0,
    balance: state => state.balance
  }
})
