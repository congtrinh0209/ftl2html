var ftl2html = require("../index.js")
var path = require("path")
var fs = require("fs")
var expect = require("chai").expect
var spawnSync = require("child_process").spawnSync

var srcRoot = path.resolve(__dirname, "_src")
var dataRoot = path.resolve(__dirname, "_tdd")
var targetRoot = path.resolve(__dirname, "_target")
var tmpRoot = path.resolve(__dirname, "_tmp")

var ftlExt = ".ftl"
var tddExt = ".tdd"
var htmlExt = ".html"
var logFile = "./fmpp.log"
var javaVersion = 1.7

function readFile(filePath, fileName) {
    return fs.readFileSync(path.resolve(filePath, fileName + htmlExt), "utf8")
}

describe("java runtime", function() {
    var res = spawnSync("java", ["-version"])
    var version = parseFloat(res.stderr.toString().match(/java version \"([\d,\.,\_]+)\"/)[1])

    it("has java runtime", function() {
        expect(res.stderr.toString()).to.include("java version")
    })

    it("java version is " + javaVersion + " or later", function() {
        expect(version).to.be.at.least(javaVersion)
    })
})

describe("usage unexpect", function() {
    it("use ftl2html unexpect", function() {
        var res = ftl2html()
        expect(res).to.equal(false)
    })
})

describe("recommand usage", function() {
    var f = new ftl2html({
        isDebug: false,
		async: true,
        sourceRoot: srcRoot,
        dataRoot: dataRoot,
        outputRoot: tmpRoot,
        tddFiles: [path.resolve(dataRoot, "common" + tddExt)]
    })

    it("covert fmpp normally config async", function(done) {
        var fileName = "normal"

        f.render({
            ftlFile: fileName + ftlExt,
            callback: function(error, stdout, stderr, fileName) {
                expect(readFile(targetRoot, fileName)).to.equal(readFile(tmpRoot, fileName))
                done()
            }
        })
    })

    it("covert fmpp normally config async with subfolder", function(done) {
        var fileName = "subFolder/normal"

        f.render({
            ftlFile: fileName + ftlExt,
            callback: function(error, stdout, stderr) {
                // var target = pathpath.join(targetRoot, fileName + ftlExt)
                // var tmp = path.join(tmpRoot, fileName + ftlExt)

                expect(readFile(targetRoot, fileName)).to.equal(readFile(tmpRoot, fileName))
                done()
            }
        })
    })

    it("covert bad template warning", function(done) {
        var fileName = "error"

        f.render({
            ftlFile: fileName + ftlExt,
            callback: function(error, stdout, stderr, fileName) {
                fs.access(path.resolve(tmpRoot, fileName + htmlExt), function(err) {
                    expect(err).to.not.be.null
                    done()
                })
            }
        })
    })

    it("covert template without match tdd", function(done) {
        var fileName = "nomatchtdd"

        f.render({
            ftlFile: fileName + ftlExt,
            done: function(error, stdout, stderr, fileName) {
                expect(readFile(targetRoot, fileName)).to.equal(readFile(tmpRoot, fileName))
                done()
            }
        })
    })

    it("covert fmpp normally config sync", function() {
        var fileName = "normal"

        f.render({
			async: false,
            ftlFile: fileName + ftlExt
        })
        expect(readFile(targetRoot, fileName)).to.equal(readFile(tmpRoot, fileName))
    })

    it("covert bad template warning sync", function(done) {
        var fileName = "error"

        f.render({
			async: false,
            ftlFile: fileName + ftlExt
        })

        fs.access(path.resolve(tmpRoot, fileName + htmlExt), function(err) {
            expect(err).to.not.be.null
            done()
        })
    })
})

describe("compatible", function() {
    describe("fmpp", function() {
        it("covert fmpp normally", function() {
            var fileName = "normal"
            ftl2html(srcRoot, tmpRoot, fileName + ftlExt, path.resolve(dataRoot, fileName + tddExt) + ", " + path.resolve(dataRoot, "common" + tddExt), logFile)
            expect(readFile(targetRoot, fileName)).to.equal(readFile(tmpRoot, fileName))

        })

        it("covert bad template warning", function(done) {
            var fileName = "error"
            ftl2html(srcRoot, tmpRoot, fileName + ftlExt, path.resolve(dataRoot, fileName + tddExt) + ", " + path.resolve(dataRoot, "common" + tddExt))
            fs.access(path.resolve(tmpRoot, fileName + htmlExt), function(err) {
                expect(err).to.not.be.null
                done()
            })
        })

        it("covert template without match tdd", function() {
            var fileName = "nomatchtdd"
            ftl2html(srcRoot, tmpRoot, fileName + ftlExt, path.resolve(dataRoot, fileName + tddExt) + ", " + path.resolve(dataRoot, "common" + tddExt))
            expect(readFile(targetRoot, fileName)).to.equal(readFile(tmpRoot, fileName))

        })
    })

    describe("extend syntax", function() {
        var fileName = "parseObj"
        ftl2html(srcRoot, tmpRoot, fileName + ftlExt, path.resolve(dataRoot, fileName + tddExt) + ", " + path.resolve(dataRoot, "common" + tddExt), logFile)
        var expectContent = JSON.parse(readFile(targetRoot, fileName).toString())
        var covertContent = JSON.parse(readFile(tmpRoot, fileName).toString())

        it("parse Object correct", function() {
            expect(expectContent.object).to.deep.equal(covertContent.object)
        })

        it("parse Array correct", function() {
            expect(expectContent.array).to.deep.equal(covertContent.array)
        })

        it("parse ObjectArray correct", function() {
            expect(expectContent.objectArray).to.deep.equal(covertContent.objectArray)
        })
    })

    describe("default param", function() {
        var fileName = "normal"
        ftl2html(srcRoot, tmpRoot, fileName + ftlExt, path.resolve(dataRoot, fileName + tddExt) + ", " + path.resolve(dataRoot, "common" + tddExt))
        it("default log path", function(done) {
            fs.access(path.resolve("./fmpp.log"), function(err) {
                expect(err).to.be.null
                done()
            })
        })
    })
})
