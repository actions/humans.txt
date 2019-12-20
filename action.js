'use strict'

const fs = require('fs')
const yaml = require('yaml')
const chalk = require('chalk')

const formatters = {
  txt: txtFormatter,
  html: htmlFormatter,
  json: jsonFormatter,
  shell: (data, opts) => txtFormatter(data, { ...opts, colors: true}),
}

main()

function main() {
  const format = process.argv[2] || ((process.env.GITHUB_ACTION || process.stdout.isTTY) ? "shell" : "txt")
  const output = process.argv[3] ? fs.openSync(process.argv[3], "w+") : 1;

  const formatter = formatters[format]
  if (!formatter) {
    invalidFormat(format)
    return
  }

  const data = yaml.parse(fs.readFileSync(__dirname + "/humans.txt.yaml", {encoding: "utf8"}))

  formatter(data, {output})
}

function invalidFormat(format) {
  const list = Object.keys(formatters).sort().join(",")
  console.error(`'${format}' is not one of the accepted formats ${list}`)
  process.exitCode = 1
  return
}

function jsonFormatter({humans}, {output}) {
  fs.writeSync(output, JSON.stringify(humans, null, 4))
}

function txtFormatter({humans}, {colors = false, output} = {}) {
  let active = humans.filter(h => !h.alum).map(h => h.name)
  let alum = humans.filter(h => h.alum).map(h => h.name)

  if(colors) {
    const total = active.length + alum.length
    active = mapColorRange(active, 0, total)
    alum = mapColorRange(alum, active.length, total)
  }

  fs.writeSync(output, "Current humans\n")
  fs.writeSync(output,"==============\n\n")
  fs.writeSync(output,active.join("\n"))
  fs.writeSync(output,"\n\n")

  fs.writeSync(output,"Human alumni\n")
  fs.writeSync(output,"============\n\n")
  fs.writeSync(output,alum.join("\n"))
}

function mapColorRange(strings, base, total) {
  return strings.map((n, i) => chalk.hsl(((i + base) / total) * 360, 100, 50)(n))
}

function htmlFormatter(data, opts) {
  fs.writeSync(opts.output, `<!doctype html>
    <meta charset='utf8' />
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <title>Actions - humans.txt</title>
    <body><pre>`)
  txtFormatter(data, opts)
  fs.writeSync(opts.output, "</pre></body>")
}
