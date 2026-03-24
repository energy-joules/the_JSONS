// search and filters for events
function searchEvents(events, appliedSearch, appliedCategory) {
  return events.filter((event) => {

    // if the event is canceled dont show it (if not deleted from the database)
    if (event.status !== "active") {
      return false;
    }

    // normalize the search input
    const normalizedSearch = appliedSearch.trim().toLowerCase();

    // check if search term matches
    const matchesSearch =
      normalizedSearch === "" ||
      event.name.toLowerCase().includes(normalizedSearch) ||
      event.description.toLowerCase().includes(normalizedSearch) ||
      event.location.toLowerCase().includes(normalizedSearch) ||
      event.address.toLowerCase().includes(normalizedSearch);

    // check if search category matches
    const matchesCategory =
      appliedCategory === "all" || event.category === appliedCategory;

    return matchesSearch && matchesCategory;
  });
}

export default searchEvents;