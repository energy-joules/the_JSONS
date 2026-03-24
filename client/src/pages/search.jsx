import { useMemo, useState } from "react";
import exampleEvents from "../data/exampleEvents";
import searchEvents from "../utils/searchEvents";

function Search() {
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

  // filters the shared event data
  const filteredResults = useMemo(() => {
    return searchEvents(exampleEvents, appliedSearch, appliedCategory);
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

          <form className="search-panel mb-3" onSubmit={handleSearch}>
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

          <div className="search-divider"></div>

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