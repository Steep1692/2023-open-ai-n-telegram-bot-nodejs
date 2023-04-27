import path from 'path'
import fs from 'fs'

import { DIR_PATH_PUBLIC, FILE_PATH_VIEW_ADD } from '../../utils/constants.js'
import { openFile } from '../../utils/filesystem.js'

export const handleRouteStatic = (req, res) => {
  let filePath
  if (req.url === '/') {
    filePath = FILE_PATH_VIEW_ADD
  } else {
    filePath = path.join(DIR_PATH_PUBLIC, req.url)
  }

  var extname = path.extname(filePath)
  var contentType = 'text/html'
  switch (extname) {
    case '.js':
      contentType = 'text/javascript'
      break
    case '.css':
      contentType = 'text/css'
      break
    case '.json':
      contentType = 'application/json'
      break
    case '.png':
      contentType = 'image/png'
      break
    case '.jpg':
      contentType = 'image/jpg'
      break
    case '.wav':
      contentType = 'audio/wav'
      break
  }

  const content = openFile(filePath, {
    onError: (error) => {
      if (error) {
        if (error.code == 'ENOENT') {
          fs.readFile('./404.html', function (error, content) {
            res.writeHead(200, { 'Content-Type': contentType })
            res.end(content, 'utf-8')
          })
        } else {
          res.writeHead(500)
          res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n')
          res.end()
        }
      }
    }
  })

  if (content) {
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(content, 'utf-8')
  }
}