<template>
	<div class="chart-container"><canvas ref="myChart" style="width: 96%;"></canvas>
		<div style="color: black;">
			<p>moneyInPool: {{ moneyInPool }}</p>
			<p>tokenInPool: {{ tokenInPool }}</p>
			<p>currentStep: {{ currentStep }}</p>
			<p>totalSupply: {{ totalSupply }}</p>
		</div>
	</div>
</template>
<script type="text/javascript">
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);
import helper from "../../helper";
import Web3 from "web3";
import { mapMutations, mapGetters } from 'vuex';
import vref from "../../contract/vref.json";
import Moralis from 'moralis/dist/moralis.min.js';

export default {
	data() {
		return {
			chart: null,
			historyData: [],
			forecastData: [],
			tokenInPool: 0,
			moneyInPool: 0,
			currentStep: 0,
			totalSupply: 0,
			active: true
		}
	},
	computed: {
		...mapGetters(['isConnected', 'chainName', 'history', 'chainId'])
	},
	watch: {
		async isConnected(active) {
			if ( !active ) return;
			let _moneyInPool = await this.VREF.methods._moneyInPool().call();
			let _tokenInPool = await this.VREF.methods._tokenInPool().call();
			this.currentStep = await this.VREF.methods.currentStep().call();
			this.active = await this.VREF.methods.status().call();
			this.totalSupply = Web3.utils.fromWei(await this.VREF.methods.totalSupply().call());

			this.moneyInPool = Web3.utils.fromWei(_moneyInPool, 'ether');
			this.tokenInPool = Web3.utils.fromWei(_tokenInPool, 'ether');

			if ( vref.moralis[this.chainName] ) {
				this.getEvents(vref.moralis[this.chainName]);
				this.getContractEvents(vref.moralis[this.chainName])
			}

		},
		history: {
	      deep: true,
	      handler(trans) {
	        if ( trans.length==0 ) return;
	        fetch("https://vinet.gostudio.co/script", {
	          method: "POST",
	          headers: {
	            'Content-Type': 'application/json'
	          },
	          body: JSON.stringify({
	            script: trans.map(tx => ({
	              name: tx.event,
	              address: tx.data.address,
	              amount: parseInt(this.formatCurrency(tx.data.amount, VREF))
	            }))
	          })
	        }).then(res => res.json()).then(res => {
	          this.historyData = res;
	          let maxPrice = 0;
	          let maxMoney = 0;
	          res.forEach(p => {
	            let price = p.tokenInPool==0 ? 0 : p.moneyInPool/p.tokenInPool;
	            maxPrice = Math.max(price, maxPrice)
	            maxMoney = Math.max(p.moneyInPool, maxMoney)
	          })
	          return this.loadForecast(maxPrice, maxMoney).then(res => {
	            this.drawChart();
	          })
	        })
	      }
	    },
	    selectedTx() {
	      this.drawChart();
	    }
	},
	methods: {
		...mapMutations([ 'setHistory', 'setSelectedTx' ]),
		chartDatasets() {
	      let type = 'price-token';
	      let bubbles = this.historyData.map((p,idx) => ({
	        type: 'bubble',
	        label: 'Transaction #'+(idx+1),
	        data: [{
	          x: type=='price-token' ? p.tokenInPool : idx,
	          y: p.moneyInPool/p.tokenInPool,
	          r: 6
	        }],
	        backgroundColor: idx==this.selectedTx ? 'red' : 'rgba(0,255,0,0.5)'
	      }));
	      return [...bubbles, {
	        type: 'scatter',
	        label: "forecast",
	        options: { plugins: { legend: { display: false }, } },
	        data: this.forecastData.map((p,idx) => ({
	          x: type=='price-token' ? p.tokenInPool : idx,
	          y: p.moneyInPool/p.tokenInPool
	        }))
	      }]
	    },
		drawChart() {
	      if ( this.chart ) {
	        this.chart.data.datasets = this.chartDatasets();
	        this.chart.update()
	        return;
	      }
	      const ctx = this.$refs['myChart'].getContext('2d');
	      this.chart = new Chart(ctx, {
	        data: {
	          datasets: this.chartDatasets()
	        },
	        options: {
	          scales: {
	            y: {
	              beginAtZero: true
	            }
	          },
	          animation: {
	            duration: 0
	          }
	        }
	      });
	    },
	    loadForecast(maxPrice, maxMoney) {
	      return fetch(`https://vinet.gostudio.co/forecast?maxPrice=${maxPrice}&maxMoney=${maxMoney}`).then(res => res.json()).then(res => {
	        this.forecastData = res;
	        return true;
	      }).catch(e => {
	        return []
	      })
	    },
	    async getEvents(server) {
		  Moralis.start(server)
		  const params = {
		    limit: 0,
		    offset: 0,
		  };
		  return Moralis.Cloud.run('getBuyEvents', params).then(txs => {
				this.transactions = txs.result.map(tx => ({
					transactionHash: tx.transaction_hash,
					event: "buy",
					data: tx.data
				}));
				this.setHistory(this.transactions);
				return true;
	    	});
		},
		async getContractEvents(server, fromDate, toDate, address) {
			Moralis.start(server)
			const params = {
				networkId: this.chainId,
				fromDate: fromDate || new Date("2022/01/01"),
				toDate: toDate || new Date(Date.now()),
				address
			}
			const transactions = await Moralis.Cloud.run("getTransactions", params)
			console.log(transactions)
		}
	},
	async mounted() {
		Chart.defaults.plugins.legend.display = false;
	},
	mixins: [helper]
}
</script>
<style scoped>
.chart-container {
	width: 96%;
	background: white;
	margin: 0 auto;
	padding:  20px;
}
</style>