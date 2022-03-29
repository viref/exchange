<template>
	<div id="plot">
	</div>
</template>
<script type="text/javascript">
import functionPlot from 'function-plot'
import pool from '../../helper/pool'
export default {
	data() {
		return {
			relaseAmount: 1000000
		}
	},
	methods: {
		icoPriceAt(k) {
			return pool.icoPrice[k]/100;
		},
		tokenBeforeICO(k) {
			return pool.tokenBeforeICO[k]/10**18;
		},
		tokenAfterICO(k) {
			return this.tokenBeforeICO(k)+this.relaseAmount/2;
		},
		moneyAfterICO(k) {
			let delta = k>0 ? this.poolConstantAt(k-1)*1.4142135623730951/this.tokenAfterICO(k-1) : 0;
			return delta + (this.relaseAmount/2) * this.icoPriceAt(k)
		},
		poolConstantAt(k) {
			if ( k==-1 ) return 0;
			return this.tokenAfterICO(k) * this.moneyAfterICO(k)
		}
	},
	mounted() {
		let width = 1000;
		let height = 600;

		// for ( let i=0; i<5; i++ ) {
		// 	console.log({
		// 		tokenAfterICO: this.tokenAfterICO(i),
		// 		moneyAfterICO: this.moneyAfterICO(i),
		// 		poolConstantAt: this.poolConstantAt(i),
		// 	})
		// }

		let plotData = {
		  target: "#plot",
		  width,
		  height,
		  grid: true,
		  disableZoom: true
		};
		let dataSets = [];
		let maxX = 0;
		let maxY = 0;
		for ( let i=0; i<3; i++ ) {
			dataSets.push({
				fn: this.icoPriceAt(i).toString(), // ICO price
		    	range: [this.tokenBeforeICO(i), this.tokenAfterICO(i)],
		    	color: "rgba(100, 100, 100, 0.3)"
			})
			dataSets.push({
				fn: this.poolConstantAt(i)+"/x^2", // IDO
		    	range: [this.tokenBeforeICO(i+1), this.tokenAfterICO(i)],
		    	color: "rgba(100, 100, 100, 0.3)"
			})
			maxX = this.tokenAfterICO(i);
			maxY = this.icoPriceAt(i);
		}
		dataSets.push({
		    // x: 10000,
		    // y: 0.1,
		    fnType: 'points',
		    points: [[10000, 0.1]],
		    graphType: 'scatter'
		})
		plotData.xAxis = { domain: [0, maxX] };
		plotData.yAxis = { domain: [0, maxY+0.1] };
		plotData.data = dataSets;
		console.log(plotData);
		functionPlot(plotData);
	}
}
</script>
<style scoped>
#plot {
	background: white;
	color: black;
}
</style>