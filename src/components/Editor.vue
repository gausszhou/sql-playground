<script setup lang="ts">
import type { Database, QueryExecResult } from 'sql.js'
import { onMounted, ref } from 'vue'
import { getSqlInstance } from '@/utils'

let db: Database | null = null
const sql = ref('SELECT * FROM test;')
const result = ref<QueryExecResult[]>([{ columns: [], values: [] }])
const error = ref<string>('')

async function executeSql() {
  if (!db) {
    error.value = 'Database not initialized'
    return
  }
  try {
    result.value = db.exec(sql.value)
    error.value = ''
  }
  catch (err) {
    error.value = (err as Error).message
  }
}

onMounted(async () => {
  db = await getSqlInstance()
  db.run('CREATE TABLE IF NOT EXISTS test (id INT PRIMARY KEY, name TEXT)')
  db.run('INSERT INTO test (id, name) VALUES (1, \'test\')')
  db.run('INSERT INTO test (id, name) VALUES (2, \'test2\')')
})
</script>

<template>
  <div class="sql-playground">
    <div class="sql-playground-head">
      <button @click="executeSql">
        ▶ Execute
      </button>
    </div>
    <div class="sql-playground-body">
      <div class="sql-input-container">
        <textarea v-model="sql" class="sql-input" />
      </div>
      <div class="sql-result-container">
        <div v-if="error" class="sql-result-error">
          {{ error }}
        </div>
        <div v-else class="sql-result-success">
          <table v-for="(res, index) in result" :key="index" class="sql-result-table">
            <thead>
              <tr>
                <th v-for="col in res.columns" :key="col">
                  {{ col }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in res.values" :key="i">
                <td v-for="(v, j) in row" :key="j">
                  {{ v }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sql-playground {
  width: 100%;
}

.sql-playground-head {
  padding: 10px;
  border: 1px solid #242424;
  border-radius: 8px;
  margin-bottom: 10px;
}

.sql-playground-body {
  width: 100%;
  height: 600px;
  display: flex;
  gap: 20px;

  .sql-input-container {
    flex: 1;
    border: 1px solid #242424;
    border-radius: 8px;
    overflow: hidden;
    .sql-input {
      width: 100%;
      height: 100%;
      outline: none;
      resize: none;
      border: none;
    }
  }

  .sql-result-container {
    flex: 1;
    border: 1px solid #242424;
    border-radius: 8px;
  }

}
</style>
