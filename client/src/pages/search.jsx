import { useEffect, useState } from "react";
import { getEvents, searchEventsApi } from "../api/eventsApi";

function formatEventDate(raw) {
  if (!raw) return "";
  const d = new Date(raw);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadEvents(query) {
    setLoading(true);
    setError(null);
    try {
      const q = (query ?? "").trim();
      const data = q ? await searchEventsApi(q) : await getEvents();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents("");
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    await loadEvents(searchInput);
  }

  return (
    <main className="search-page">
      <section className="py-5">
        <div className="container">
          <div className="search-header text-center mb-5">
            <h1 className="fw-bold mb-3">Find Volunteer Opportunities</h1>
            <p className="search-subtext text-secondary">
              Search local volunteer opportunities by event name.
            </p>
          </div>

          <form className="search-panel mb-3" onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search by event name"
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
            {loading && (
              <p className="text-center text-secondary">Loading...</p>
            )}

            {error && (
              <p className="text-center text-danger">{error}</p>
            )}

            {!loading && !error && results.length === 0 && (
              <p className="text-center text-secondary">No results found.</p>
            )}

            {!loading && !error && results.map((event) => (
              <div key={event._id ?? event.eventId} className="result-item">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-3">
                  <div>
                    <h3 className="fw-bold mb-2">{event.name}</h3>
                    <p className="text-secondary mb-1">
                      {formatEventDate(event.date)}
                      {event.duration != null ? ` · ${event.duration}h` : ""}
                    </p>
                    <p className="text-secondary mb-0">{event.address}</p>
                  </div>

                  <div className="result-meta text-md-end">
                    <p className="mb-0">
                      <strong>Spots:</strong>{" "}
                      {event.currentPeople ?? 0}
                      {event.maxPeople != null ? `/${event.maxPeople}` : ""}
                    </p>
                  </div>
                </div>

                <p className="mb-0">{event.description}</p>

                <div className="d-flex justify-content-end pt-3 mt-3 border-top">
                  <button type="button" className="btn btn-dark btn-sm">
                    Sign up
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Search;