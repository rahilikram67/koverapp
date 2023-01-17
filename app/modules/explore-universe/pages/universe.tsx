import { IconButton, InputBase, Paper } from "@material-ui/core"
import ClearIcon from "@material-ui/icons/ClearOutlined"
import SearchIcon from "@material-ui/icons/SearchOutlined"
import MainLayout from "app/core/layouts/MainLayout/MainLayout"
import { BlitzPage, Routes, usePaginatedQuery } from "blitz"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import UniverseTable from "../components/UniverseTable"
import searchUniverse from "../queries/searchUniverse"

const limit = 10

const MockConnector: BlitzPage = () => {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(0)

  const { register, handleSubmit } = useForm()

  const [universe, { isLoading }] = usePaginatedQuery(
    searchUniverse,
    {
      searchString: search,
      skip: currentPage * limit,
      take: limit,
    },
    {
      suspense: false,
    }
  )

  const onSubmit = async (values: { search: string }) => {
    const { search } = values

    setSearch(search)
  }

  const handleChangePage = (
    _e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) => {
    setCurrentPage(page)
  }

  return (
    <>
      <Paper
        component="form"
        sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}
        onSubmit={handleSubmit(onSubmit)}
        onReset={() => setSearch("")}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Universe"
          inputProps={{ "aria-label": "search universe products" }}
          {...register("search")}
        />
        {search && (
          <IconButton type="reset" sx={{ p: "10px" }} aria-label="clear">
            <ClearIcon />
          </IconButton>
        )}
        <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <br />
      <UniverseTable
        records={universe?.records || []}
        loading={isLoading}
        totalRecords={universe?.count || 0}
        currentPage={currentPage}
        handleChangePage={handleChangePage}
        searchTerm={search}
      />
    </>
  )
}

MockConnector.suppressFirstRenderFlicker = true

MockConnector.authenticate = { redirectTo: Routes.LoginPage() }

MockConnector.getLayout = (page) => <MainLayout title="Explore Universe">{page}</MainLayout>

export default MockConnector
