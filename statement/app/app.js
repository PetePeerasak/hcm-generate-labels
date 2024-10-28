const fs = require("fs")
const path = require("path")
const { exec } = require('child_process')
require('dotenv').config()

const HOME_DIR = process.env.HOME_DIR
const files = fs.readdirSync(`${HOME_DIR}/source/labels`)
  .filter(item => path.extname(item) === '.sql')

// Structure
// CODAPP          VARCHAR2(20 CHAR)
// NUMSEQ          NUMBER
// TYPSCR          VARCHAR2(50 CHAR)
// DESCLABELE      VARCHAR2(150 CHAR)
// DESCLABELT      VARCHAR2(150 CHAR)
// DESCLABEL3      VARCHAR2(150 CHAR)
// DESCLABEL4      VARCHAR2(150 CHAR)
// DESCLABEL5      VARCHAR2(150 CHAR)
// DTECREATE       DATE
// CODCREATE       VARCHAR2(50 CHAR)
// DTEUPD          DATE
// CODUSER         VARCHAR2(50 CHAR)

const options = { encoding: 'utf8', flag: 'r' }
const language = ['en', 'th']

const splitStringToArray = (statement, arrItems = []) => {
  const singleLines = statement.split('\n')
  const singleQuteRegex = /'[^']*'/g;
  const valuesRegex = /values\s*\(([^)]*)\)/i;

  return new Promise(resolve => {
    singleLines.forEach(message => {
      const match = message.match(valuesRegex)
      const inSingleQute = message.match(singleQuteRegex)

      if (match && inSingleQute) {
        const values = match[1].split(',')
        const codapp = inSingleQute[0].toUpperCase() ?? ''
        const numseq = values[1]
        const typscr = values[2]
        const dtecreate = values[values.length - 4]
        const codcreate = values[values.length - 3]
        const dteupd = values[values.length - 2]
        const coduser = values[values.length - 1]

        arrItems.push([
          codapp, numseq, typscr,
          inSingleQute[1], inSingleQute[2], inSingleQute[3], inSingleQute[4], inSingleQute[5],
          dtecreate, codcreate, dteupd, coduser
        ])
      }
    })

    resolve(arrItems)
  })
}

const loopStringByLang = async (fileName, strLines) => {
  let content = ''
  for (const lang of language) {
    if (lang === 'en') {
      content += `const labelsEn = {\n`
    } else {
      content += `const labelsTh = {\n`
    }

    const items = await pushStringToTheFile(lang, strLines)
    content = createContent(content, items)
    content += '\n'
  }

  content += `
    module.exports = {
      en: labelsEn,
      th: labelsTh,
      103: labelsEn,
      104: labelsEn,
      105: labelsEn
    }
  `

  writeFile(content, fileName)
}

const pushStringToTheFile = (currentLang, items, arrItems = []) => {
  return new Promise(resolve => {
    for (const item of items) {
      const codapp = item[0].replace(/'/g, '')
      const numseq = item[1].replace(/'/g, '')
      const content = item[currentLang === 'en' ? 3 : 4]

      if (arrItems[codapp] === undefined) {
        arrItems[codapp] = []
      }

      arrItems[codapp].push({ [`${numseq}`]: content })
    }

    resolve(arrItems)
  })
}

const pushBodyToContent = (item) => {
  const index = Object.keys(item)
  return `${index}: ${item[index]},\n`
}

const createContent = (content, items) => {
  for (const i in items) {
    content += `'${i}': {\n`
    items[i].map(item => {
      content += pushBodyToContent(item)
    })
    content += `},\n`
  }
  content += `}\n`

  return content
}

const writeFile = (content, fileName) => {
  fileName = fileName.replace('.sql', '').toLowerCase()
  const pathFile = `${HOME_DIR}/source/dist/${fileName}.js`

  fs.writeFile(pathFile, content, err => {
    if (err) {
      console.error(`on open: ${err}`)
      return
    }

    exec(`npx prettier --config ${HOME_DIR}/app/.prettierrc --write ${pathFile}`)
    console.log(`Result: ${fileName} -> ${pathFile}`)
  })
}

for (const file of files) {
  const statement = fs.readFileSync(`${HOME_DIR}/source/labels/${file}`, options)

  splitStringToArray(statement)
    .then(items => loopStringByLang(file, items))
}
