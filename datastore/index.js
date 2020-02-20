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
  console.log('path is here --->', thisPath);
  fs.readFile(thisPath, (err, file) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      console.log('file is this thing here --->', file);
      callback(null, {id: id, text: String(file)});
    }
  });
};

// exports.update = (id, text, callback) => {
//   // var item = items[id];
//   // if (!item) {
//   //   callback(new Error(`No item with id: ${id}`));
//   // } else {
//   //   items[id] = text;
//   //   callback(null, { id, text });
//   // }

//   fs.readdir(exports.dataDir, (err, items) => {
//     if (err) {
//       console.log('cannot find that file');
//     } else {
//       if (err) {
//         console.log('Error- that todo does not exist');
//       } else {
//         fs.writeFile(items[id], text, (err) => {
//           if (err) {
//             console.log('Error- file not over-written');
//           } else {
//             items[id] = text; 
//             callback(null, { id, text });
//           }
//         });
//       }
//     }
//   });
// };

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
