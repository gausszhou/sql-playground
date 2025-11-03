import initSqlJs from 'sql.js'
import sqlWasm from 'sql.js/dist/sql-wasm.wasm?url'

export function getExampleSqlOptions() {
  return [
    {
      label: 'Show version',
      value: 'SELECT sqlite_version()',
    },
    {
      label: 'Show tables',
      value: `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;`,
    },
    {
      label: 'Show test table',
      value: `SELECT * FROM test;`,
    },
  ]
}

async function readFileAsBuffer(file: File): Promise<Uint8Array> {
  if (!file) {
    throw new Error('File not provided')
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer
      const uint8Array = new Uint8Array(arrayBuffer)
      resolve(uint8Array)
    }
    reader.onerror = reject
  })
}

export async function getSqlInstance(file?: File) {
  const SQL = await initSqlJs({
    locateFile: () => sqlWasm,
  })
  if (!file) {
    return new SQL.Database()
  }
  const uint8Array = await readFileAsBuffer(file)
  return new SQL.Database(uint8Array)
}
