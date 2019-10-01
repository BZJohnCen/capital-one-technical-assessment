module.exports.check = (extension) => {
    let syntax = {
        extension: "",
        comment: "",
        blockCommentStart: "",
        blockCommentEnd: "",
        string: [],
        supportsBlock: null
    }
    switch (extension) {
        case '.js':
            syntax.extension = extension[0]
            syntax.comment = "//"
            syntax.blockCommentStart = "/*"
            syntax.blockCommentEnd = "*/"
            syntax.string = ["\"", "'", "`"]
            syntax.supportsBlock = true
            break;
        case '.ts':
            syntax.extension = extension[0]
            syntax.comment = "//"
            syntax.blockCommentStart = "/*"
            syntax.blockCommentEnd = "*/"
            syntax.string = ["\"", "'", "`"]
            syntax.supportsBlock = true
            break;
        case '.py':
            syntax.extension = extension[0]
            syntax.comment = "#"
            syntax.blockCommentStart = ""
            syntax.blockCommentEnd = ""
            syntax.string = ["\"", "'", "'''"]
            syntax.supportsBlock = false
            break;
        default:
            syntax.extension = extension[0]
            syntax.comment = "//"
            syntax.blockCommentStart = "/*"
            syntax.blockCommentEnd = "*/"
            syntax.string = ["\""]
            syntax.supportsBlock = true
    }
    return syntax
}