const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    fs.writeFile(path.join(exports.dataDir, `${data}.txt`), text, (err) => {
      if (err) {
        console.log('Error- file not written');
      } else {
        items[data] = text; 
        callback(null, { id: data, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  var data = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('cannot read all files');
    } else {
      files.forEach((file) => {
        var justNumber = file.substring(0, 5);
        data.push({id: justNumber, text: justNumber});
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var thisPath = exports.dataDir + '/' + `${id}.txt`;
  fs.readFile(thisPath, (err, file) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id: id, text: String(file)});
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    var thisPath = exports.dataDir + '/' + `${id}.txt`;
    fs.writeFile(thisPath, text, (err) => {
      if (err) {
        callback(new Error('Could not update todo'));
      } else {
        callback(null, {id, text});
      }
    });
  }
};

exports.delete = (id, callback) => {
  var thisPath = exports.dataDir + '/' + `${id}.txt`;
  fs.unlink(thisPath, (err, file) => {
    if (err) {
      callback(new Error('Cannot delete this todo'));
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
