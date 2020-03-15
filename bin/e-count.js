const program = require('commander')
const fs = require('fs')
const path = require('path')

program
    .usage('<filepath>')
    .parse(process.argv)

const filepath = program.args[0]

// 需要统计的文件类型
var codesFiles = ['.css', '.less', '.sass', '.js', '.html', '.vue', '.jsx', '.tmpl', '.json', '.java', '.sh', '.component']
var LINES = 0
var FILES = 0
var findFolder = function (srcDir, cb) {
    fs.readdir(srcDir, function (err, files) {
        var count = 0
        var checkEnd = function () {
            ++count === files.length && cb && cb()
        }
        if (err) {
            checkEnd()
            return
        }
        files.forEach(function (file) {
            var extname = path.extname(file).toLowerCase()
            var srcPath = path.join(srcDir, file)
            fs.stat(srcPath, function (err, stats) {
                if (err) {
                    console.log(err)
                    return
                }
                if (stats.isDirectory()) {
                    findFolder(srcPath, checkEnd)
                } else {
                    if (codesFiles.indexOf(extname) < 0) {
                        checkEnd()
                        return
                    }
                    fs.readFile(srcPath, function (err, data) {
                        if (err) {
                            checkEnd()
                            return
                        }
                        FILES += 1
                        var lines = data.toString().split('\n')
                        LINES += lines.length
                        console.log(srcPath, lines.length)
                        checkEnd()
                    })
                }
            })
        })
        // 为空时直接回调
        files.length === 0 && cb && cb()
    })
}

findFolder(filepath, function () {
    console.log('FILES:', FILES)
    console.log('LINES:', LINES)
})
