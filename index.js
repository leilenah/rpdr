$(document).ready(function(){
	redrawBernoulliPmf()
    console.log(rpdr_seasons_data)
})

function redrawBernoulliPmf() {
	const parentDivId = 'bernoulliPmf'
    const a = parseFloat($('#pmfA').val())
    const b = parseFloat($('#pmfB').val())
    const c = parseFloat($('#pmfC').val())
    const d = parseFloat($('#pmfD').val())
	const p = getP(a, b, c, d)
	drawBernoulliPmf(parentDivId, p)
}

function getP(episodeCount, episodeWinCount, episodeBottomCount, contestantsRemainingCount) {
    return 0.60
}

function drawBernoulliPmf(parentDivId, p) {
	if(window.myBernLine) {
		window.myBernLine.destroy()
	}
	var xValues = [0, 1]
	var q = 1 - p;
	var yValues = [q.toFixed(5), p.toFixed(5)]
	let xLabel = 'Values that X can take on'
	let yLabel = 'Probability'

	var config = {
		type: 'bar',
		data: {
			labels: xValues,
			datasets: [{
				label: 'P(x)',
				fill: false,
				backgroundColor: 'pink',
				borderColor: 'pink',
				data: yValues,
				pointRadius:1,
				maxBarThickness:100
			}]
		},
		options: {

			steppedLine: false,
			responsive: true,
			tooltips: {
				mode: 'index',
				intersect: false,
			},
			hover: {
				mode: 'nearest',
				intersect: true
			},
			legend: {
	            display: false
	         },
			scales: {
				xAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: xLabel
					}
				}],
				yAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: yLabel
					},
					ticks: {
                        beginAtZero: true,
                        steps: 10,
                        stepValue: 0.1,
                        max: 1.0
                    }
				}]
			}
		}
	};
	var ctx = document.getElementById(parentDivId).getContext('2d');
	window.myBernLine = new Chart(ctx, config);
}
