import {
  Chip,
  Collapse,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from "@material-ui/core"
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons"
import { Box } from "@material-ui/system"
import { Source, Universe } from "db"
import moment from "moment"
import * as React from "react"

const getSourceName = (source: Source) => {
  switch (source) {
    case "BEST_BUY":
      return <Chip label="Bestbuy" color="primary" />
    case "HARRODS":
      return <Chip label="Harrods" color="info" />
    default:
      return ""
  }
}

interface RowProps {
  record: Universe & {
    valueHistory: {
      retrievalDate: Date
      assetValue: number
      currency: string
      source: string
      createdAt: Date
      updatedAt: Date
    }[]
  }
}

function Row({ record }: RowProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ maxWidth: "200px" }}>{record.productId}</TableCell>
        <TableCell>{record.name}</TableCell>
        <TableCell>
          <b>{record.brand}</b>
        </TableCell>
        <TableCell>{getSourceName(record.source)}</TableCell>
        <TableCell>{record.underwriterClassId}</TableCell>
        <TableCell>{record.categories.length ? record.categories.join(", ") : "N/A"}</TableCell>
        <TableCell>
          {record.manufactureDate ? moment(record.manufactureDate).format("LLLL") : "N/A"}
        </TableCell>
        <TableCell>{moment(record.updatedAt).format("LLLL")}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, borderBottom: "none" }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <TableContainer component={Paper}>
              <Table sx={{ width: "100%" }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Id</b>
                    </TableCell>
                    <TableCell>
                      <b>Asset Value</b>
                    </TableCell>
                    <TableCell>
                      <b>Source</b>
                    </TableCell>
                    <TableCell>
                      <b>Retrievel Date</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {record.valueHistory.map((value, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{value.assetValue}</TableCell>
                      <TableCell>{value.source}</TableCell>
                      <TableCell>{moment(value.retrievalDate).format("LLLL")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

interface UniverseProps {
  loading: boolean
  totalRecords: number
  currentPage: number
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) => void
  records: (Universe & {
    valueHistory: {
      retrievalDate: Date
      assetValue: number
      currency: string
      source: string
      createdAt: Date
      updatedAt: Date
    }[]
  })[]
  searchTerm: string
}

export default function UniverseTable({
  loading,
  records,
  totalRecords,
  currentPage,
  handleChangePage,
  searchTerm,
}: UniverseProps) {
  return (
    <>
      <TableContainer component={Paper}>
        {loading && <LinearProgress />}
        <Table aria-label="collapsible table" size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                <b>Product Id</b>
              </TableCell>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Brand</b>
              </TableCell>
              <TableCell>
                <b>Source</b>
              </TableCell>
              <TableCell>
                <b>Underwriter Class Id</b>
              </TableCell>
              <TableCell>
                <b>Categories</b>
              </TableCell>
              <TableCell>
                <b>Manufacture Date</b>
              </TableCell>
              <TableCell>
                <b>Last Updated</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <Row key={record.id} record={record} />
            ))}
          </TableBody>
        </Table>
        {!records.length && !loading && (
          <Box justifyContent="center" padding="20px" textAlign="center">
            <Typography variant="body2">
              No records found with search term <b>{`'${searchTerm}'`}</b>. Try searching with
              another term!
            </Typography>
          </Box>
        )}
      </TableContainer>
      {totalRecords ? (
        <TablePagination
          component="div"
          rowsPerPageOptions={[10]}
          count={totalRecords}
          rowsPerPage={10}
          page={currentPage}
          onPageChange={handleChangePage}
        />
      ) : null}
    </>
  )
}
