import fs from 'fs'

export const openFile = (fileDir, options) => {
  try {
    return fs.readFileSync(fileDir, "utf-8")
  } catch (e) {
    if (options?.onError) {
      options.onError(e);
    }
    return options?.defaultValue
  }
}

export const writeFile = (fileDir, value) => {
  try {
    fs.writeFileSync(fileDir, value)
  } catch (e) {
    // noop
  }
}
