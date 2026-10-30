import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const EMPTY = { clients: {}, pending: {}, codes: {}, refresh: {} }

export function createOAuthStore(filePath) {
  let chain = Promise.resolve()

  async function read() {
    try {
      const raw = await readFile(filePath, 'utf8')
      const data = JSON.parse(raw)
      return {
        clients: data.clients || {},
        pending: data.pending || {},
        codes: data.codes || {},
        refresh: data.refresh || {},
      }
    } catch (err) {
      if (err?.code === 'ENOENT') return structuredClone(EMPTY)
      throw err
    }
  }

  async function write(data) {
    await mkdir(dirname(filePath), { recursive: true })
    const tmp = `${filePath}.tmp`
    await writeFile(tmp, JSON.stringify(data), { mode: 0o600 })
    await rename(tmp, filePath)
  }

  function update(mutator) {
    const run = chain.then(async () => {
      const data = await read()
      const now = Date.now()
      for (const [id, row] of Object.entries(data.pending)) {
        if (!row?.expiresAt || row.expiresAt <= now) delete data.pending[id]
      }
      for (const [id, row] of Object.entries(data.codes)) {
        if (!row?.expiresAt || row.expiresAt <= now) delete data.codes[id]
      }
      for (const [id, row] of Object.entries(data.refresh)) {
        if (!row?.expiresAt || row.expiresAt <= now) delete data.refresh[id]
      }
      const result = await mutator(data)
      await write(data)
      return result
    })
    chain = run.then(() => {}, () => {})
    return run
  }

  return {
    update,
    read: () => update(async (data) => data),
  }
}
