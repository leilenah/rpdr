$(document).ready(function(){
	redrawBernoulliPmf();
    evaluate();
})


function evaluate() {
    // const winners = getContestants(rpdr_seasons_data, 'winners');
    // const losers = getContestants(rpdr_seasons_data, 'losers');
}


function redrawBernoulliPmf() {
	const parentDivId = 'bernoulliPmf'
    const d = parseFloat($('#pmfD').val())
    const r = parseFloat($('#pmfR').val())
    const a = parseFloat($('#pmfA').val())
    const g = parseFloat($('#pmfG').val())
	const p = getPWinGivenPerformance(d, r, a, g);
    const roundedP = Number((p).toFixed(5)).toString();

    document.getElementById('dynamic-p').innerHTML =  roundedP;
	drawBernoulliPmf(parentDivId, p)
}


function getPWinGivenPerformance(
    episodeCount,
    episodeWinCount,
    episodeBottomCount,
    contestantsRemainingCount,
) {
    const winners = getContestants(rpdr_seasons_data, 'winners');
    const losers = getContestants(rpdr_seasons_data, 'losers');
    const pWin = 1 / contestantsRemainingCount;
    const pLose = 1 - pWin;
    const pPerformanceGivenWin = getPPerformance(
        winners,
        episodeCount,
        episodeWinCount,
        episodeBottomCount,
    );
    const pPerformanceGivenLose = getPPerformance(
        losers,
        episodeCount,
        episodeWinCount,
        episodeBottomCount,
    )

    const bayesNumerator = pPerformanceGivenWin * pWin;
    const bayesDenominator = bayesNumerator + (pPerformanceGivenLose * pLose);

    return bayesNumerator / bayesDenominator;
}


function getPPerformance(
    contestants,
    episodeCount,
    episodeWinCount,
    episodeBottomCount,
) {
    const winRatio = episodeWinCount / episodeCount;
    const bottomRatio = episodeBottomCount / episodeCount;
    const matches = []

    for (const contestant of contestants) {
        const contestantWinRatio = contestant["challenge wins"] / contestant["normalized episode count"];
        const contestantBottomRatio = contestant["normalized bottom count"] / contestant["normalized episode count"];

        if (contestantWinRatio <= winRatio && contestantBottomRatio <= bottomRatio) {
            matches.push(contestant)
        }
    }

    if (matches.length == 0) {
        return Number.EPSILON
    }
    return matches.length / contestants.length
}


function getContestants(data, type) {
    const result = [];
    for (const season of data) {
        const contestants = season["contestants"];
        const seasonEpisodeCount = season["episode count"]
        const normalizedEpisodeCount = seasonEpisodeCount - 1;  // exclude finale

        for (const contestant of contestants) {
            contestant["normalized episode count"] = normalizedEpisodeCount;

            if (contestant["episode count"] == seasonEpisodeCount) {
                contestant["normalized bottom count"] = contestant["bottom two"];
            } else {
                contestant["normalized bottom count"] = contestant["bottom two"] + (normalizedEpisodeCount - contestant["episode count"]);
            }

            if (type == 'winners') {
                if (contestant["won season"]) {
                    result.push(contestant)
                }
            } else if (type == 'losers') {
                if (!contestant["won season"]) {
                    result.push(contestant)
                }
            } else {
                result.push(contestant)
            }
        }
    }
    return result
}


function arrAvg(arr) {
    return arr.reduce((a,b) => a + b, 0) / arr.length;
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
				backgroundColor: '#80dfff',
				borderColor: '#80dfff',
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
						labelString: xLabel,
                        fontColor: '#ff8080',
                        fontFamily: 'Turret Road',
                        fontSize: 14,
					},
                    ticks: {
                        fontColor: '#ff8080',
                        fontFamily: 'Turret Road',
                    },
				}],
				yAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: yLabel,
                        fontColor: '#ff8080',
                        fontFamily: 'Turret Road',
                        fontSize: 14,
					},
					ticks: {
                        fontColor: '#ff8080',
                        fontFamily: 'Turret Road',
                        beginAtZero: true,
                        steps: 10,
                        stepValue: 0.1,
                        max: 1.0,
                    },
				}]
			}
		}
	};
	var ctx = document.getElementById(parentDivId).getContext('2d');
	window.myBernLine = new Chart(ctx, config);
}
