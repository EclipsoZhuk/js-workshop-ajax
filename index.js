function fetchData() {
    fetch('./ZonAnn.Ts+dSST.csv')
        .then(response => response.text())
        .then(console.log);
}

fetchData();
