const useQueryParams = () => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")
    const pk = params.get("pk")

    return { id, pk }
}

export default useQueryParams
