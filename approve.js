const fs = require('fs')
const child_process = require('child_process')

exports.approve = function (name, value, dir) {
  var approved = dir + '/' + name + '.approved.txt'
  var received = dir + '/' + name + '.received.txt'

  var approvedExists = fs.existsSync(approved)
  if (approvedExists) {
    if (value === fs.readFileSync(approved, { encoding: 'utf-8' })) {
      if (fs.existsSync(received)) fs.unlinkSync(received)
      return
    }
  }
  console.log('--- ' + name)
  fs.writeFileSync(received, value, { encoding: 'utf-8' })

  var diff = (process.env.DIFF || 'diff -C4 --color').split(' ')
  var editor = (process.env.EDITOR || 'cat').split(' ')
  if (approvedExists)
    child_process.spawnSync(diff[0], diff.slice(1).concat(received, approved), {
      stdio: 'inherit',
    })
  else
    child_process.spawnSync(editor[0], editor.slice(1).concat(received), {
      stdio: 'inherit',
    })

  process.stdout.write('Do you approve? [Y]')
  var buffer = Buffer.alloc(1)
  fs.readSync(0, buffer, 0, 1)
  if (buffer.toString() != '\n') throw 'Not approved'

  fs.renameSync(received, approved)
}
