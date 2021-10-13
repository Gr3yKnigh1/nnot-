const {ipcRenderer} = require("electron");
const fs = require("fs");

const codeElm = document.getElementById("code");
const filePathElm = document.getElementById("filePath")
let currentFilePath;

codeElm.onchange = function() {
  filePathElm.innerText = `${currentFilePath}*`;
}

ipcRenderer.on("openFile", (event, filePath) => {
  currentFilePath = filePath;
  const fileContent = fs.readFileSync(filePath, "utf-8");
  codeElm.value = fileContent;
  filePathElm.innerText = currentFilePath;
})

ipcRenderer.on("saveFile", (event) => {
  const currentText = codeElm.value;
  fs.writeFileSync(currentFilePath, currentText, "utf-8");
  filePathElm.innerText = currentFilePath;
})