const ctx = document.querySelector('.js-chart').getContext('2d');
const GLOBAL_MEAN_TEMPERATURE = 14;

fetchData()
    .then(parseData)
    .then(getLabelsAndData)
    .then(({ years, tempsGlob, northHem, southHem }) =>
        drawChart(years, tempsGlob, northHem, southHem),
    );

function fetchData() {
    return fetch('./ZonAnn.Ts+dSST.csv').then(response => response.text());
}

function parseData(data) {
    return Papa.parse(data, { header: true }).data;
}

function getLabelsAndData(data) {
    return data.reduce(
        (acc, entry) => {
            acc.years.push(entry.Year);
            acc.tempsGlob.push(Number(entry.Glob) + GLOBAL_MEAN_TEMPERATURE);
            acc.northHem.push(Number(entry.NHem) + GLOBAL_MEAN_TEMPERATURE);
            acc.southHem.push(Number(entry.SHem) + GLOBAL_MEAN_TEMPERATURE);

            return acc;
        },
        { years: [], tempsGlob: [], northHem: [], southHem: [] },
    );
}

function drawChart(labels, data, northHem, southHem) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: '# Средняя глобальная температура',
                    data,
                    borderColor: 'rgba(76, 180, 57, 1)',
                    borderWidth: 1.5,
                },

                {
                    label: '# Средняя температура в North Hemisphere',
                    data: northHem,
                    borderColor: 'rgba(184, 27, 56, 1)',
                    borderWidth: 1.5,
                },

                {
                    label: '# Средняя температура в Southern Hemisphere',
                    data: southHem,
                    borderColor: 'rgba(37, 109, 148, 1)',
                    borderWidth: 1.5,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback(value) {
                            return value + '°С';
                        },
                    },
                },
            },
            animations: {
                tension: {
                    duration: 2000,
                    easing: 'easeInOutQuad  ',
                    from: 1,
                    to: 0,
                    loop: true,
                },
            },
        },
    });
}
