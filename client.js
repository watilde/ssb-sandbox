var fs = require('fs')
var pull = require('pull-stream')
var toPull = require('stream-to-pull-stream')
var ssbClient = require('ssb-client')

function createPackage (sbot, package, cb) {
  sbot.publish({
    type: 'create-file-package',
    package: package
  }, cb)
}

function addFile (sbot, package, name, fileData, cb) {
  sbot.publish({
    type: 'add-file-to-package',
    package: package,
    name: name,
    fileData: fileData
  }, cb)
}

function removeFile (sbot, package, name, cb) {
  sbot.publish({
    type: 'remove-file-from-package',
    package: package,
    name: name
  }, cb)
}

function addFileFromDisk (sbot, package, name, filePath, cb) {
  pull(
    toPull.source(fs.createReadStream(filePath)),
    sbot.blobs.add(function (err, fileId) {
      if (err)
        cb(err)
      else {
        addFile(sbot, package, name, fileId, cb)
      }
    })
  )
}

ssbClient(function (err, sbot) {
  addFileFromDisk(sbot, 'ffffff', 'ffffff.jpg', './ffffff.jpg', console.log)
})
