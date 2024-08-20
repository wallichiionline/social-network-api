const getDate = () => {
    var date = new Date(this.createdAt);
    return date.toLocaleDateString();
};

module.exports = getDate;