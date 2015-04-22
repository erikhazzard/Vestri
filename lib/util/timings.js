// --------------------------------------
//
// Timing 
//
// --------------------------------------
var Timings = function(){
    this._start = process.hrtime();
    this._data = [];
};

Timings.prototype.push = function push( el ){
    var diff = process.hrtime(this._start);
    el.time = (diff[0] * 1e9 + diff[1]) / 1e6;

    if(this._data.length > 0){
        el.timeSinceLastCall = el.time - this._data[this._data.length-1].time;
    }

    return this._data.push(el);
};

Timings.prototype.toJSON = function( ){
    // Only return data when JSON'ing
    return this._data;
};
Timings.prototype.toString = function( ){
    // Only return data when turning to a string
    return JSON.stringify(this._data);
};

module.exports = Timings;
