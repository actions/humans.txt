'use strict'

const fs = require('fs')
const yaml = require('yaml')

const formatters = {
  txt: txtFormatter,
  json: jsonFormatter,
  shell: (data) => txtFormatter(data, { colors: true}),
}

main()

function main() {
  const format = process.argv[2]

  const formatter = formatters[format]
  if (!formatter) {
    invalidFormat(format)
    return
  }

  const data = yaml.parse(fs.readFileSync("./humans.txt.yaml", {encoding: "utf8"}))

  formatter(data)
}

function invalidFormat(format) {
  const list = Object.keys(formatters).sort().join(",")
  console.error(`'${format}' is not one of the accepted formats ${list}`)
  process.statusCode = 1
  return
}

function jsonFormatter({humans}) {
  console.log(JSON.stringify(humans, null, 4))
}

function txtFormatter({humans}, {colors = false} = {}) {
  let active = humans.filter(h => !h.alum).map(h => h.name)
  let alum = humans.filter(h => h.alum).map(h => h.name)

  if(colors) {
    const chalk = require('chalk')
    const total = active.length + alum.length
    active = active.map((n, i) => chalk.hsl((i / total) * 360, 100, 50)(n))
    alum = alum.map((n, i) => chalk.hsl(((i + active.length) / total) * 360, 100, 50)(n))
  }

  console.log("Current humans")
  console.log("==============\n")
  console.log(active.join("\n"))
  console.log("\n")

  console.log("Human alumni")
  console.log("============\n")
  console.log(alum.join("\n"))
}


