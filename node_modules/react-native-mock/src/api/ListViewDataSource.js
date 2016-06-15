

class ListViewDataSource {
  constructor() {
    this._dataBlob = null;
  }

  getRowCount() {

  }

  cloneWithRows(data) {
    var newSource = new ListViewDataSource();
    newSource._dataBlob = data;

    return newSource;
  }
  
  cloneWithRowsAndSections(data) {
      var newSource = new ListViewDataSource();
      newSource._dataBlob = data;
  
      return newSource;
  }
}

module.exports = ListViewDataSource;
