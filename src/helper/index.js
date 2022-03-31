import { mapMutations, mapGetters } from 'vuex';
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

export default {
	data() {
		return {
			USDC: null,
			VREF: null,
		}
	},
	computed: {
		...mapGetters([
			'getABI', 'isConnected'
		]),
		usdc() {
			return this.getABI('usdc')
		},
		vref() {
			return this.getABI('vref')
		}
	},
	watch: {
		isConnected(value) {
			if (!this.USDC && window.USDC) {
				this.USDC = window.USDC;
				this.VREF = window.VREF;
			}
		}
	},
	methods: {
		...mapMutations(['setChainId', 'setAccounts']),
		async contract(name) {
			let contract = new window.web3.eth.Contract(this[name].abi, this[name].address);
			contract.decimals = await contract.methods.decimals().call();
			return contract
		},
		async connectContract() {
			if ( !window.web3.eth || !this.usdc ) return false;
	        if ( !window.USDC ) {
				window.USDC = await this.contract('usdc');
				window.VREF = await this.contract('vref');
	        }
		},
	    async getCurrentNetwork() {
	      return window.web3.eth.net.getId();
	    },
		async switchNetwork() {
			return window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: chainId.bsc }],
	        });
		},
		async connectWallet() {
	      const providerOptions = {
	        walletconnect: {
	          package: WalletConnectProvider, // required
	          options: {
	            infuraId: "1a466cc6a1314f818035d806ffbf7f71" // required
	          }
	        }
	      };
	      this.web3Modal = new Web3Modal({
	        // network: "mainnet", // optional
	        cacheProvider: true, // optional
	        providerOptions // required
	      });
	      let provider;
	      try {
	        provider = await this.web3Modal.connect();
	      } catch(e) {
	        console.log("Could not get a wallet connection", e);
	        return;
	      }
	      window.web3 = new Web3(provider);
	      this.networkId = await this.getCurrentNetwork();
	      this.setChainId(this.networkId);
	      return this.getAccounts().then(async accounts => {
	        await this.connectContract();
	        this.setAccounts( accounts )
	        ethereum.on("chainChanged", () => {
	          window.location.reload();
	        });
	        return true;
	      })
	    },
	    async disconnectWallet() {
	      await this.web3Modal.clearCachedProvider();
	      window.location.reload();
	    },
	    async getAccounts() {
	      if ( window.ethereum )
	        return window.ethereum.request({ method: 'eth_accounts' })
	      return [];
	    },
	    detectEthereum() {
	      const { ethereum } = window;
	      if (ethereum && ethereum.isMetaMask) {
	        console.log('Ethereum successfully detected!');
	      } else {
	        console.log('Please install MetaMask!');
	      }
	    },
		async getEstimateGas(method, amount, expected) {
			let address = await this.getAccounts().then((accounts) => (accounts[0]).toLowerCase())
			return this.VREF.methods[`${method}`](amount, expected)
			.estimateGas({from: address})
			.then((gas) => {console.log(window.web3.utils.fromWei(BigInt(parseFloat(gas)).toString(), 'gwei'))})
			.catch(error => {
				let errorSignature = window.web3.eth.abi.encodeFunctionSignature('Error(string)')
				let errorObj = JSON.parse(error.message.replace('Internal JSON-RPC error.', ''))
        		let errorMessage = window.web3.eth.abi.decodeParameter('string', errorObj.data.replace(errorSignature, ''))
				throw new Error(errorMessage)
			})
		}
	},
	mounted() {
		this.USDC = window.USDC;
		this.VREF = window.VREF;
	}
}
