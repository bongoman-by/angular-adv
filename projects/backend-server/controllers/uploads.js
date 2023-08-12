const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const { actualizeImage } = require("../helpers/actualize-image");

const fileUpload = async (req, res = response) => {
  const type = req.params.type || "";
  const id = req.params["id"];
  const modelTypes = ["doctors", "hospitals", "users"];

  if (!modelTypes.includes(type)) {
    return res.status(400).json({
      ok: false,
      msg: `Extension ${type} is not valid, it should be doctors|hospitals|users`,
    });
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: `No files were uploaded.`,
    });
  }

  const file = req.files.image;

  const fileNameAsArray = file.name.split(".");
  const extension = fileNameAsArray[fileNameAsArray.length - 1];

  const extensionTypes = ["jpeg", "png", "gif", "jpg"];

  if (!extensionTypes.includes(extension)) {
    return res.status(400).json({
      ok: false,
      msg: `Extension ${extension} is not valid, it should be jpeg|png|gif|jpg`,
    });
  }

  const appDir = path.dirname(require.main.filename);
  const fileName = `${uuidv4()}.${extension}`;
  const uploadPath = `${appDir}/uploads/${type}/${fileName}`;

  await file.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).json({
        ok: false,
        msg: err.message,
      });
    }

    if (actualizeImage(type, id, fileName, appDir)) {
      res.json({
        ok: true,
        msg: "File is uploaded and add as property!",
        image: fileName,
      });
    }
  });
};

const viewImage = async (req, res = response) => {
  const type = req.params.type || "";
  const photo = req.params["photo"];
  const modelTypes = ["doctors", "hospitals", "users"];

  if (!modelTypes.includes(type)) {
    return res.status(400).json({
      ok: false,
      msg: `Extension ${type} is not valid, it should be doctors|hospitals|users`,
    });
  }

  const appDir = path.dirname(require.main.filename);
  const imagePath = `${appDir}/uploads/${type}/${photo}`;

  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.sendFile(`${appDir}/uploads/image-not-found.png`);
  }
};

module.exports = { fileUpload, viewImage };
