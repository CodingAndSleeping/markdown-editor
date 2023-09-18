import {dialog} from 'electron';
import fs from 'fs';

const decoder = new TextDecoder()
export default function(){
  const file = dialog.showOpenDialogSync({
    properties: ['openFile']
  })

  if(file){
    const a =  fs.readFileSync(file[0])
    console.log(a)

    console.log( decoder.decode(a))
  }
  
}
