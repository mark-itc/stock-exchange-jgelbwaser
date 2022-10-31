class Marquee {

    static urlAPIFixed= 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/stock-screener?exchange=NASDAQ&limit=';
    static APIResultLimit = 100;

    constructor(container) {
        this.container = container;
    }

    async load() {
        const url = Marquee.urlAPIFixed + Marquee.APIResultLimit;
        const apiArray = await this.makeApiRequest(url);
        const MarqueeHtml =  this.getMarqueeHTML(apiArray);
        this.container.innerHTML = MarqueeHtml;
    }


    getMarqueeHTML(apiArray) {
        let scrollingSpan = `<span class="scrolling">`;

        scrollingSpan += apiArray.reduce((htmlSrting, currentApiObj) => {
            const priceTwoDecimals = parseFloat(currentApiObj.price).toFixed(2)
            const currentItemHTML  = `
            <a class="marquee-link" href="/company.html?symbol=${currentApiObj.symbol}">
                <span class="marquee-symbol">${currentApiObj.symbol}</span>
                <span class="marquee-price-change">$${priceTwoDecimals}</span>
            </a>`;
                return htmlSrting + currentItemHTML
         },"");

         scrollingSpan += "</span>";

         //two tags are required for continuos scrolling animation
         return scrollingSpan + scrollingSpan;  

         
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
