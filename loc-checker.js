const fs = require('fs')
const SyntaxChecker = require("./syntax-checker")

const extensionRegEx = /\.[a-z]{1,5}$/i

let totalLoc = 0, totalComments = 0, totalSingleLineComments = 0, 
    totalBlockCommentLoc = 0, totalBlockComments = 0, totalTodos = 0

//--------------- MAIN FUNCTION ---------------

module.exports.locChecker = (filename, dir) => checkLinesOfCode(filename, dir)

//--------------- HELPER FUNCTIONS ---------------

const readFile = (filename, dir) => fs.createReadStream(__dirname + dir + filename, 'utf8')

const incrementCommentCounters = () => {
    totalSingleLineComments++                
    totalComments++
}

const isCommentWrappedInString = (line, language) => {
    let foundCommentIndex = line.indexOf(language.comment)
    let quoteTypeFound = ""
    let startQuoteIndex = 0, endQuoteIndex = 0
    for (let i = 0; i < language.string.length; i++){
        if (line.indexOf(language.string[i]) > 0) quoteTypeFound = language.string[i]
    }
    if (line.includes(quoteTypeFound)) {
        startQuoteIndex = line.indexOf(quoteTypeFound)
        endQuoteIndex = line.indexOf(quoteTypeFound, startQuoteIndex+1)
    }
    return (foundCommentIndex > endQuoteIndex || foundCommentIndex < startQuoteIndex)
}

const incrementBlockCommmentCounters = (locList, i, endBlockIndex) => {
    let blockCommentList = locList.slice(i, endBlockIndex + 1)
    blockCommentList.forEach((line) => { if (line.includes("TODO:")) totalTodos++ })        
    totalBlockComments++
    totalBlockCommentLoc += blockCommentList.length
    totalComments += blockCommentList.length
}

//--------------- MAIN HELPER FUNCTION ---------------

const checkLinesOfCode = (filename, dir) => {
    if (dir === undefined) dir = ""
    if (filename.match(extensionRegEx) === null || filename.charAt(1) === ".") 
        throw "Invalid filename."
    let language = SyntaxChecker.check(filename.match(extensionRegEx)[0])
    let locList = []

    try {
        let stream = readFile(filename, dir)
        stream.on('data', dataChunk => {
            locList = dataChunk.split("\n").map(line => line.trim())
            //find total lines of code
            totalLoc = locList.length
            //find all metrics
            let i = 0
            for (i = 0; i < totalLoc; i++) {
                let line = locList[i]
                if (language.supportsBlock) {                   
                    if (line.startsWith(language.comment)) { //SINGLE COMMENT
                        if (line.includes("TODO:")) totalTodos++
                        incrementCommentCounters()
                    } else if (line.includes(language.comment)) { //SINGLE COMMENT WITHIN THE LINE                                           
                        let isValidComment = isCommentWrappedInString(line, language)
                        if (isValidComment) {
                            if (line.indexOf("TODO:", line.indexOf(language.comment)) > 0) totalTodos++
                            incrementCommentCounters() 
                        }                                                          
                    } else if (line.startsWith(language.blockCommentStart) || line.includes(language.blockCommentStart)) { //BLOCK COMMENTS
                        if (line.includes(language.blockCommentEnd)) { //BLOCK COMMENT IN ONE LINE
                            totalBlockComments++
                            totalBlockCommentLoc++
                            totalComments++
                        } else {
                            let endBlockIndex = locList.indexOf(language.blockCommentEnd, i) //find closing block comment
                            if (endBlockIndex < 0) { //closing block comment is within a line
                                let currentLineIndex = i
                                while (endBlockIndex < 0) {
                                    if (locList[currentLineIndex].includes("*/")) {
                                        endBlockIndex = currentLineIndex
                                    } else {
                                        currentLineIndex++
                                    }                    
                                }
                            }
                            incrementBlockCommmentCounters(locList, i, endBlockIndex)
                            i = endBlockIndex
                        }
                    }
                } else { //language does not support block comments
                    if (line.startsWith(language.comment) || line.includes(language.comment)) { //SINGLE COMMENT
                        if (!locList[i+1].startsWith(language.comment)){
                            let isValidComment = isCommentWrappedInString(line, language)
                            if (isValidComment || line.startsWith(language.comment)) {
                                if (line.indexOf("TODO:", line.indexOf(language.comment)) > 0) totalTodos++
                                incrementCommentCounters()
                            }                  
                        } else { //BLOCK COMMENTS
                            let endBlockIndex = -1, currentLineIndex = i
                            while (endBlockIndex < 0) {
                                if (locList[currentLineIndex+1].startsWith(language.comment)){
                                    currentLineIndex++
                                } else {
                                    endBlockIndex = currentLineIndex
                                }
                            }
                            incrementBlockCommmentCounters(locList, i, endBlockIndex)
                            i = endBlockIndex
                        }
                    }
                }
            }
        })

        stream.on('end', () => {
            console.log('\n------ Stream Ended ------\n')
            console.log("\nTotal number of lines:", totalLoc)
            console.log("totalComments:", totalComments)
            console.log("totalSingleLineComments:", totalSingleLineComments)
            console.log("totalBlockCommentLoc:", totalBlockCommentLoc)
            console.log("totalBlockComments:", totalBlockComments)
            console.log("totalTodos:", totalTodos)

            //JAVA EXAMPLE
            // Total # of lines: 60                                     
            // Total # of comment lines: 28
            // Total # of single line comments: 6                       
            // Total # of comment lines within block comments: 22       
            // Total # of block line comments: 2                        
            // Total # of TODO’s: 1                                     

            //JS EXAMPLE
            // Total # of lines: 40
            // Total # of comment lines: 23
            // Total # of single line comments: 5
            // Total # of comment lines within block comments: 18
            // Total # of block line comments: 4
            // Total # of TODO’s: 1

            //PYTHON EXAMPLE
            // Total # of lines: 61
            // Total # of comment lines: 19
            // Total # of single line comments: 9
            // Total # of comment lines within block comments: 10
            // Total # of block line comments: 3
            // Total # of TODO’s: 3
        })

    } catch (err) {
        console.error('caught err while trying to read file:', err.message)
        return null
    } 
}

//*readStream saves chunks of the file data in memory at a time
// var fs = require('fs');
// var path = require('path');
// var readStream = fs.createReadStream(path.join(__dirname, '../rooms') + '/rooms.txt', 'utf8');
// let data = ''
// readStream.on('data', function(chunk) {
//     data += chunk;
// }).on('end', function() {
//     console.log(data);
// });

//*readFile saves whole file data in memory
// let data = fs.readFileSync(__dirname + "/" + filename)
// return data