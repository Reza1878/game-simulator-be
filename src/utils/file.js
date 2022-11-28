const fs = require('fs');

exports.deleteFile = (path) => {
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
