const fs = require('fs')
const path = require('path')
const TABLE_NAME = process.env.TABLE_NAME.toUpperCase()

let files = fs.readdirSync('./source/labels')
  .filter(item => path.extname(item) === '.js')

const lange = 'en'
const getFilename = (file) => {
  return (file && file !== '') ? file.replace('.js', '') : ''
}

for (const file of files) {
  let message = `SET DEFINE OFF;\n`

  const labels = require(`./source/labels/${file}`)
  const fileName = getFilename(file)

  for (const label of Object.keys(labels[lange])) {
    message += `DELETE FROM ${TABLE_NAME} WHERE CODAPP='${label.toUpperCase()}';\n`
  }

  for (const fnName in labels[lange]) {
    for (const index in labels[lange][fnName]) {
      let name = {
        en: labels['en'][fnName][index].replace("'", "''"),
        th: labels['th'][fnName][index].replace("'", "''"),
        103: labels['103'][fnName][index].replace("'", "''"),
        104: labels['104'][fnName][index].replace("'", "''"),
        105: labels['105'][fnName][index].replace("'", "''")
      }

      message += `INSERT INTO ${TABLE_NAME} VALUES ('${fnName}',${index},NULL,'${name['en']}','${name['th']}','${name['103']}','${name['104']}','${name['105']}',SYSDATE,NULL,SYSDATE,'TJS00001');\n`
    }
  }

  message += 'commit;\n'

  fs.writeFile(`./source/dist/${fileName.toLowerCase()}_a.sql`, message, err => {
    if (err) {
      console.error(`on open: ${err}`)
      return
    }
  })

  console.log(`Result: ${fileName} -> ./source/dist/${fileName.toLowerCase()}_a.sql`)
}

