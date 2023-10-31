export default class CandlePoint{
    constructor(timestamp, open, high, low, close ){
        this.x = new Date(timestamp);
        this.y = [parseFloat(open),parseFloat(high), parseFloat(low), parseFloat(close)];
    }
    
    getTime(){
        return this.x;
    }

    getOpen(){
        return this.y[0];
    }

    getHigh(){
        return this.y[1];
    }

    getLow(){
        return this.y[2];
    }

    getClose(){
        return this.y[3];
    }
}