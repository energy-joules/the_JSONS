import { useMemo, useState } from "react";
import exampleEvents from "../data/exampleEvents";
import searchEvents from "../utils/searchEvents";

function MapPage() {
  const [searchInput, setSearchInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("all");

  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("all");

  function handleSearch(event) {
    event.preventDefault();
    setAppliedSearch(searchInput);
    setAppliedCategory(categoryInput);
  }

  const filteredResults = useMemo(() => {
    return searchEvents(exampleEvents, appliedSearch, appliedCategory);
  }, [appliedSearch, appliedCategory]);

  return (
    <main className="map-page">
      <section className="map-layout">
        <aside className="map-sidebar">
          <div className="map-sidebar-inner">
            <div className="map-sidebar-header">
              <h1 className="fw-bold mb-3">
                Nearby Opportunities ({filteredResults.length})
              </h1>

              <form onSubmit={handleSearch}>
                <div className="d-flex flex-column gap-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search opportunities"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />

                  <select
                    className="form-select"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="community">Community</option>
                    <option value="education">Education</option>
                    <option value="environment">Environment</option>
                    <option value="health">Health</option>
                  </select>

                  <button type="submit" className="btn btn-dark">
                    Search
                  </button>
                </div>
              </form>

              <div className="map-divider"></div>
            </div>

            <div className="nearby-results">
              {filteredResults.length === 0 ? (
                <p className="text-secondary mb-0">No nearby opportunities found.</p>
              ) : (
                filteredResults.map((event) => (
                  <div key={event.eventId} className="map-result-card">
                    <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                      <h3 className="fw-bold mb-0">{event.name}</h3>
                      <span className="map-distance">{event.location}</span>
                    </div>

                    <p className="mb-2 text-capitalize text-secondary">
                      {event.category}
                    </p>

                    <p className="mb-2 text-secondary">
                      {event.date} · {event.duration}
                    </p>

                    <p className="mb-2">{event.address}</p>

                    <p className="mb-2">
                      <strong>Spots:</strong> {event.currentPeople}/{event.maxPeople}
                    </p>

                    <p className="mb-0">{event.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        <div className="map-view">
          <div className="map-placeholder">
            <div className="map-placeholder-inner">
              <h2 className="fw-bold mb-2">Google Map Goes Here</h2>
              <p className="text-secondary mb-0">
                Later this panel will show the user location and event markers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MapPage;