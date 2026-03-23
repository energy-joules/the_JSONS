import { useMemo, useState } from "react";

function Search() {
  const exampleEvents = [
    {
      eventId: 1,
      organizationId: 101,
      maxPeople: 25,
      currentPeople: 10,
      name: "Example Result: Community",
      category: "community",
      location: "Gainesville",
      description: "Example description for example purposes.",
      date: "2026-03-28",
      duration: "3 hours",
      address: "123 Main St, Gainesville, FL",
      status: "active"
    },
    {
      eventId: 2,
      organizationId: 102,
      maxPeople: 15,
      currentPeople: 7,
      name: "Example Result: Education",
      category: "education",
      location: "Gainesville",
      description: "Example description for example purposes.",
      date: "2026-03-30",
      duration: "2 hours",
      address: "123 Main St, Gainesville, FL",
      status: "active"
    },
    {
      eventId: 3,
      organizationId: 103,
      maxPeople: 30,
      currentPeople: 18,
      name: "Example Result: Environment",
      category: "environment",
      location: "Gainesville",
      description: "Example description for example purposes.",
      date: "2026-04-02",
      duration: "4 hours",
      address: "123 Main St, Gainesville, FL",
      status: "active"
    },
    {
      eventId: 4,
      organizationId: 104,
      maxPeople: 12,
      currentPeople: 5,
      name: "Example Result: Health",
      category: "health",
      location: "Gainesville",
      description: "Example description for example purposes.",
      date: "2026-04-05",
      duration: "2.5 hours",
      address: "123 Main St, Gainesville, FL",
      status: "active"
    }
  ];

  const [searchInput, setSearchInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("all");

  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("all");

  // when you press search, applies filters
  function handleSearch(event) {
    event.preventDefault();
    setAppliedSearch(searchInput);
    setAppliedCategory(categoryInput);
  }

  // actually filters the results
  const filteredResults = useMemo(() => {
    return exampleEvents.filter((event) => {

      // if the event is canceled dont show it (if not deleted from the database)
      if (event.status !== "active") {
        return false;
      }

      // check if search term matches
      const matchesSearch =
        appliedSearch.trim() === "" ||
        event.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        event.description.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        event.location.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        event.address.toLowerCase().includes(appliedSearch.toLowerCase());

      // check if search category matches
      const matchesCategory =
        appliedCategory === "all" || event.category === appliedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [appliedSearch, appliedCategory]);

  return (
    <main className="search-page">
      <section className="py-5">
        <div className="container">
          <div className="search-header text-center mb-5">
            <h1 className="fw-bold mb-3">Find Volunteer Opportunities</h1>
            <p className="search-subtext text-secondary">
              Search for local opportunities and filter by category.
            </p>
          </div>

          <form className="search-panel mb-5" onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search by name, description, location, or address"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-3">
                <select
                  className="form-select form-select-lg"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="community">Community</option>
                  <option value="education">Education</option>
                  <option value="environment">Environment</option>
                  <option value="health">Health</option>
                </select>
              </div>

              <div className="col-12 col-md-3">
                <button type="submit" className="btn btn-dark btn-lg w-100">
                  Search
                </button>
              </div>
            </div>
          </form>

          <div className="results-list">
            {filteredResults.length === 0 ? (
              <p className="text-center text-secondary">No results found.</p>
            ) : (
              filteredResults.map((event) => (
                <div key={event.eventId} className="result-item">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-3">
                    <div>
                      <h3 className="fw-bold mb-2">{event.name}</h3>
                      <p className="text-secondary mb-1">
                        {event.location} · {event.date} · {event.duration}
                      </p>
                      <p className="text-secondary mb-0">{event.address}</p>
                    </div>

                    <div className="result-meta text-md-end">
                      <p className="mb-1">
                        <strong>Spots:</strong> {event.currentPeople}/{event.maxPeople}
                      </p>
                      <p className="mb-0">
                        <strong>Organization ID:</strong> {event.organizationId}
                      </p>
                    </div>
                  </div>

                  <p className="mb-0">{event.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Search;