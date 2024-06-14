import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select"

interface DataTableProps<TData, TValue> {
  pageSize: number
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  placeholder?: string
  searchKey?: string
  filter?: {
    data: {
      value: string
      label: string
    }[]
    key: string
  }
}

export function DataTable<TData, TValue>({
  pageSize,
  placeholder,
  searchKey,
  data,
  columns,
  filter
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize
      }
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters
    }
  })

  return (
    <div className="mt-5 w-full">
      <div className="ml-2 flex items-center py-4">
        <Input
          placeholder={placeholder ?? "Filter agencies by name..."}
          value={(table.getColumn(searchKey ?? "name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn(searchKey ?? "name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        {filter && (
          <Select
            value={(table.getColumn(filter.key)?.getFilterValue() as string) ?? ""}
            onValueChange={(e) =>
              e === "ALL"
                ? table.getColumn(filter.key)?.setFilterValue("Paid")
                : table.getColumn(filter.key)?.setFilterValue(e)
            }
          >
            <SelectTrigger className="ml-4 w-[20rem] rounded-md border bg-white px-2 py-2" defaultValue={"ALL"}>
              <SelectValue placeholder={`Filter by ${filter.key}`} />
            </SelectTrigger>
            <SelectContent id="status">
              <SelectItem value="ALL">All</SelectItem>
              {filter.data.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="mx-2 rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, { ...cell.getContext() })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 px-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
