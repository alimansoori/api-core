import { writeFileSync } from 'fs'
import { convert } from 'tsconfig-to-swcconfig'
;(async () => {
  const swcConfig = convert()
  writeFileSync(`${process.cwd()}/.swcrc`, JSON.stringify(swcConfig))
})()
