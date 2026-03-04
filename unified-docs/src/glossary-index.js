const fs = require('fs')
const defFolder = './docs/01-definitions'
const matter = require('gray-matter')

let abbreviationFldr;
try{
abbreviationFldr = fs.readdirSync(defFolder, (err,files) => {
    files.forEach(file => {
        console.log("File Name ",file.toString())
        if(file != '00-abbreviations-list.md' && file.toString().endsWith(".md")){
            fs.readFile(file, 'utf8', (err,data) => {
                if(e){
                console.log(e)
                return    
                }
                console.log(matter(data))
            })
        }
    })
})
}
catch(e){
    console.log(e)
    throw e
}
finally{
    console.log(abbreviationFldr)
}

 const createAbbrList = () => {
    //fs.writeFile()
 }