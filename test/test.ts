import { readJsonSync } from 'fs-extra'
import * as assert from 'assert'

const spec = it

describe('basic', () => {
  const a: number = 1
  spec('dummy', () => assert(1 === 1))
  const x: any = 1
  const y: any = 2
  spec('aaa', () => assert(x !== y))
})
