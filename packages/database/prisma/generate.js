const fs = require('fs')
const path = require('path')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

function getKeys(obj) {
  let keys = []
  for(let key in obj){
    keys.push(key)
  }
  return keys.sort()
}

function getField(fld) {
  switch(fld){
    case 'Boolean':  return 'boolean'; break;
    case 'DateTime': return 'Date';    break;
    case 'Decimal':  return 'number';  break;
    case 'Int':      return 'number';  break;
    case 'Json':     return 'string';  break;
    case 'String':   return 'string';  break;
  }
  return fld
}

function generateModels() {
  console.log('Generating models...')
  let text = ''
  const enums = prisma._runtimeDataModel.enums
  const models = prisma._runtimeDataModel.models

  let enumKeys = getKeys(enums) // sorted
  for(let key of enumKeys){
    text += `export enum ${key} {\n`
    for(let val in enums[key].values){
      text += `  ${enums[key].values[val].name},\n`
    }
    text = text.substr(0,text.length-2)+'\n' // remove last comma
    text += '}\n'
    text += '\n'
  }

  let modelKeys = getKeys(models) // sorted
  for(let key of modelKeys){
    text += `export interface ${key} {\n`
    for(let fld in models[key].fields){
      let field = models[key].fields[fld]
      let isObject = field.kind == 'object'
      let arr = field.isList ? '[]' : ''
      let req = (!field.isRequired || isObject) ? '?' : ''
      let type = getField(field.type)
      text += `  ${field.name}${req}: ${type}${arr}\n`
    }
    text += '}\n'
    text += '\n'
  }

  const name = path.join(__dirname, 'models.ts')
  fs.writeFileSync(name, text)
  console.log('Done')
}

generateModels()
