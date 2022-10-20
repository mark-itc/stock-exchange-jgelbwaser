// const params = new URLSearchParams(window.location.search);
// const symbol = params.get('symbol');
// console.log(symbol);

class CompanyInfo {

    static apiInfoUrl ='https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/';
    static apiChartUrl = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/GT';
    static apiChartQueryString = '?serietype=line';

    constructor(container, symbol) {
        this.symbol = symbol;
        console.log('container',container);
        console.log('symbol', symbol);
    }

    intcompanyInfoHTML() {
        return `
        `

    }

    initGraphHTML() {

    }

    async load(){
        this.companyInfo = await this.getCompanyInfo(this.symbol);
        console.log('company info', this.companyInfo);
        // this.image = companyInfo.image;
        // this.name = companyInfo.companyName;
        // this.description = companyInfo.description;
        // this.website = companyInfo.website;
        // this.price = companyInfo.price;
        // this.changesPercentage = companyInfo.changesPercentage;
        // console.log
        
    }

    async getCompanyInfo(symbol) {
        const url = CompanyInfo.apiInfoUrl + symbol;
        
        try {
            const response = await fetch(url);
            if(!response.ok) throw new Error('response status:' + response.status);
            const data = await response.json();
            return data;

        } catch(err) {
            console.log(err);

        }

    }

    addChart(){
        console.log('addChart called');
    }
}