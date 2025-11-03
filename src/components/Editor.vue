<script setup lang="ts">
import type { Database, QueryExecResult } from 'sql.js'
import { ElButton, ElOption, ElSelect } from 'element-plus'
import { onMounted, ref } from 'vue'
import { getExampleSqlOptions, getSqlInstance } from '@/utils'
import ResultTable from './ResultTable.vue'

let db: Database | null = null
const exampleSqlOptions = getExampleSqlOptions()
const sql = ref('')
const error = ref('')
const result = ref<QueryExecResult[]>([{ columns: [], values: [] }])

function onChangeSql(value: string) {
  sql.value = value
}

async function executeSql() {
  if (!db) {
    error.value = 'Database not initialized'
    return
  }
  if (!sql.value) {
    error.value = 'SQL is empty'
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

function loadFile() {
  const input = document.createElement('input')
  input.type = 'file'
  input.addEventListener('change', async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      db = await getSqlInstance(file)
    }
  })
  input.click()
}

onMounted(async () => {
  db = await getSqlInstance()
  db.run('CREATE TABLE IF NOT EXISTS test (id INT PRIMARY KEY, name TEXT)')
  db.run(`INSERT INTO test (id, name) VALUES (1, 'test')`)
  db.run(`INSERT INTO test (id, name) VALUES (2, 'test2')`)
})
</script>

<template>
  <div class="sql-playground">
    <div class="sql-playground-head">
      <ElButton type="success" @click="loadFile">
        <span>Load File</span>
      </ElButton>
      <ElSelect class="sql-playground-select" name="database" @change="onChangeSql">
        <ElOption v-for="option in exampleSqlOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </ElOption>
      </ElSelect>
      <ElButton type="primary" @click="executeSql">
        ▶ Execute
      </ElButton>
    </div>
    <div class="sql-playground-body">
      <div class="sql-input-container">
        <textarea
          v-model="sql"
          class="sql-input"
          placeholder="Enter some SQL. No inspiration ? Try “select sqlite_version()”"
        />
      </div>
      <div class="sql-result-container">
        <div v-if="error" class="sql-result-error">
          Error: {{ error }}
        </div>
        <div v-else class="sql-result-success">
          <ResultTable :result="result" />
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
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  .sql-playground-select {
    width: 200px;
  }
}

.sql-playground-body {
  width: 100%;

  .sql-input-container {
    border: 1px solid #242424;
    overflow: hidden;
    margin-bottom: 10px;
    .sql-input {
      width: 100%;
      height: calc(100vh - 750px);
      padding: 10px;
      outline: none;
      resize: none;
      border: none;
    }
  }

  .sql-result-container {
    box-sizing: border-box;
    height: 600px;
    width: 100%;
    border: 1px solid #242424;
    font-family: monospace;
    .sql-result-error {
      box-sizing: border-box;
      height: 600px;
      padding: 10px;
      display: flex;
      font-size: 14px;
      font-weight: 400;
    }
  }
}
</style>
