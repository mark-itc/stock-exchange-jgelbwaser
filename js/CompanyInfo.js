// const params = new URLSearchParams(window.location.search);
// const symbol = params.get('symbol');
// console.log(symbol);

class CompanyInfo {

    static apiInfoUrl ='https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/';
    static apiChartUrl = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/';
    static apiChartQueryString = '?serietype=line';
    static graphPointMaxQty = 100;

    constructor(container, symbol) {
        this.symbol = symbol;
        console.log('container',container);
    }

    intcompanyInfoHTML() {
        return `
        `

    }

    initGraphHTML() {

    }

    async load(){
        const url = CompanyInfo.apiInfoUrl + this.symbol;
        this.companyInfo = await this.makeApiRequest(url);
        console.log('company info', this.companyInfo);
        // this.image = companyInfo.image;
        // this.name = companyInfo.companyName;
        // this.description = companyInfo.description;
        // this.website = companyInfo.website;
        // this.price = companyInfo.price;
        // this.changesPercentage = companyInfo.changesPercentage;
        // console.log
        
    }

 
    async addChart(){
        const url = CompanyInfo.apiChartUrl + this.symbol + CompanyInfo.apiChartQueryString;
        const historicDataArray = await this.makeApiRequest(url);
        const chartData = this.getChartData(historicDataArray);


        

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
                data: chartData
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
            return {'x': item.date, 'y': item.close};
        });
        if(data.length > 1 && data.length > CompanyInfo.graphPointMaxQty) {
            const filterDivNum = Math.ceil(data.length/CompanyInfo.graphPointMaxQty);
            data = data.filter((element, index) => index%filterDivNum == 0);
        }
        return data;
    }


   

    async makeApiRequest(url) {
        try {
            const response = await fetch(url);
            if(!response.ok) throw new Error('response status:' + response.status);
            const data = await response.json();
            return data;

        } catch(err) {
            console.log(err);
        }

    }


 
}