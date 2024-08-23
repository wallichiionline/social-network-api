function getDate(d){
    var date = new Date(d);
    return date.toLocaleDateString();
}

module.exports = {getDate};