<script lang="ts" setup>
import type { QueryExecResult } from 'sql.js'

defineProps({
  result: {
    default: () => [] as QueryExecResult[],
  },
})

function getTableData(table: QueryExecResult) {
  return table.values.map((row) => {
    const obj: Record<string, any> = {}
    table.columns.forEach((col, index) => {
      obj[col] = row[index]
    })
    return obj
  })
}
</script>

<template>
  <vxe-table
    v-for="table, index in result"
    :key="index"
    border
    show-overflow
    show-header-overflow
    show-footer-overflow
    height="600"
    :header-cell-config="{ height: 36 }"
    :cell-config="{ height: 36 }"
    :column-config="{ resizable: true }"
    :virtual-y-config="{ enabled: true, gt: 0 }"
    :data="getTableData(table)"
  >
    <vxe-column v-for="(col, colIndex) in table.columns" :key="colIndex" :field="col" :title="col" width="200" />
  </vxe-table>
</template>

<style>
.vxe-table {
  font-family: monospace;
}
</style>
