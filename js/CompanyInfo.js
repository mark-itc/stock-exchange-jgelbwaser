class CompanyInfo {

    static apiInfoUrl = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/';
    static apiChartUrl = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/';
    static apiChartQueryString = '?serietype=line';
    static graphPointMaxQty = 100;

    constructor(container, symbol) {
        this.symbol = symbol;
        this.setStructureHTML(container);
        this.renderInitHTML();
    }

    setStructureHTML(container) {
        container.innerHTML = '<a class="back-link" href="/index.html">Search</a>'
        this.dataContainer = document.createElement('div');
        this.dataContainer.id = 'company-data-container';
        container.appendChild(this.dataContainer);
        this.chartContainer = document.createElement('div');
        this.chartContainer.id = 'chart-container';
        container.appendChild(this.chartContainer);
        this.chartContainer.innerHTML = `<canvas id="companyChart"></canvas>`
    }



    async load() {
        const url = CompanyInfo.apiInfoUrl + this.symbol;
        this.companyInfo = await this.makeApiRequest(url);
        this.renderCompanyData(this.companyInfo.profile);
    }

    renderInitHTML() {
        this.dataContainer.innerHTML = `
            <div class="headline mb-4 text-center d-flex align-items-center">
                <div class ="headline-logo"></div>
                <h2 class="mb-0 text-center display-6">Company Info</h2>
            </div>
            <div class="d-flex align-items-center">     
                <h3 class="stock-price">Loading...</h3>
                <span class="spinner-border" role="status"></span>
            </div>`;
        
        const canvas = document.getElementById('companyChart')
        const ctx = canvas.getContext("2d");
        ctx.textAlign = "center";
        //ctx.font="30px Comic Sans MS";
        ctx.fillStyle = 'rgb(255, 99, 132)';
        ctx.fillText("Loading graph...", canvas.width/2, canvas.height/2);

    }

    renderCompanyData(data) {
        let redClassIfNegative = '';
        if (data.changesPercentage < 0) { redClassIfNegative = 'red'; }
        this.dataContainer.innerHTML = `
          <div class="headline mb-4 text-center d-flex align-items-center">
            <a id=comp-website href="${data.website}" target="blank" class="d-flex align-items-center">
              <img id="comp-logo" class="headline-logo" src="${data.image}" alt="">
              <h2 class="mb-0 text-center display-6">${data.companyName}</h2>
            </a>
          </div>
          <h3 class="stock-price mb-3 d-flex align-items-center">
            Stock price:&nbsp;
            <span id="comp-price">${data.price}</span>&nbsp;
            <span id="comp-currency">${data.currency}</span> &nbsp;
            <span class="comp-change ${redClassIfNegative}" id="comp-change">${data.changesPercentage}</span>
          </h3>
          <p id="comp-desp">${data.description}</p>
        `;
    }

    async addChart() {
        const url = CompanyInfo.apiChartUrl + this.symbol + CompanyInfo.apiChartQueryString;
        const historicDataArray = await this.makeApiRequest(url);
        const chartData = this.getChartData(historicDataArray);
        this.renderChart(chartData);
    }

    
    renderChart(data=[]) {

        const config = {
            type: 'line',
            data: {
                //labels: dates,
                datasets: [{
                    label: 'Stock Price History',
                    fill: 'origin',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointRadius: 0,
                    pointHoverRadius: 15,
                    //data: prices
                    data: data
                }]
            },
            options: {}
        };

        const myChart = new Chart(
            document.getElementById('companyChart'),
            config
        );

    }

    getChartData(historicDataArray) {
        let data = historicDataArray.historical.map((item) => {
            return { 'x': item.date, 'y': item.close };
        });
        if (data.length > 1 && data.length > CompanyInfo.graphPointMaxQty) {
            const filterDivNum = Math.ceil(data.length / CompanyInfo.graphPointMaxQty);
            data = data.filter((element, index) => index % filterDivNum == 0);
        }
        return data;
    }


    async makeApiRequest(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('response status:' + response.status);
            const data = await response.json();
            return data;

        } catch (err) {
            console.log(err);
        }

    }



}