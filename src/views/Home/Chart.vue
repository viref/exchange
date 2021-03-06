<template>
	<div class="chart-container">
		<ul class="chart-tab">
			<li><a href="#" :class="{active: tabItem=='dot'}" @click.prevent="tabItem='dot'">Dot Chart</a></li>
			<li><a href="#" :class="{active: tabItem=='candle'}" @click.prevent="tabItem='candle'">Candle Chart</a></li>
		</ul>
		<div class="loading" v-show="loading">Loading...</div>
		<canvas v-show="tabItem === 'dot'" ref="myChart" style="width: 96%;"></canvas>
		<iframe 
			v-show="tabItem === 'candle'" 
			src="https://tradingview.viref.net/"
			frameborder="0"
			style="width: 96%;height:500px;"
		>
		</iframe>
		<!-- <div style="color: black;">
			<p>moneyInPool: {{ moneyInPool }}</p>
			<p>tokenInPool: {{ tokenInPool }}</p>
			<p>currentStep: {{ currentStep }}</p>
			<p>totalSupply: {{ totalSupply }}</p>
		</div> -->
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
			active: true,
			tabItem: "dot",
			loading: true
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

			this.setPoolState({
				moneyInPool: this.moneyInPool,
				tokenInPool: this.tokenInPool
			})

			if ( vref.moralis[this.chainName] ) {
				// this.getEvents(vref.moralis[this.chainName]);
				this.getContractEvents(vref.moralis[this.chainName])
			}
		},
		history: {
	      deep: true,
	      handler(trans) {
	        if ( trans.length==0 ) return;
	        this.loading = true;
	        fetch("https://jspool.viref.net/script", {
	          method: "POST",
	          headers: {
	            'Content-Type': 'application/json'
	          },
	          body: JSON.stringify({
	            script: trans.map(tx => ({
	              name: tx.event,
	              address: tx.data.address,
	              amount: parseFloat(tx.data.amount/10**18)
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
	        }).finally(_ => {
	        	this.loading = false;
	        })
	      }
	    },
	    selectedTx() {
	      this.drawChart();
	    }
	},
	methods: {
		...mapMutations([ 'setHistory', 'setSelectedTx', 'setPoolState' ]),
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
      return fetch(`https://jspool.viref.net/forecast?maxPrice=${maxPrice}&maxMoney=${maxMoney}`).then(res => res.json()).then(res => {
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
			this.transactions = transactions.map(tx => ({
				transactionHash: tx.transaction_hash,
				event: tx.type,
				data: {
					address: tx.address,
					amount: tx.amount
				}
			}))
			// console.log(this.transactions);
			this.setHistory(this.transactions);
		}
	},
	async mounted() {
		Chart.defaults.plugins.legend.display = false;
		if ( !this.isConnected ) {
			this.getContractEvents(vref.moralis['bsc'])
		}
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
.chart-tab {
	width: 100%;
	display: inline-block;
	margin-bottom: 20px;
}
.chart-tab li {
	float: left;
}
.chart-container, .chart-tab a {
	color: #192E38;
	padding: 5px 10px;
}
.chart-tab a.active, .chart-tab a:hover {
	text-decoration: underline;
}
</style>