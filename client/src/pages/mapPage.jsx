import { useEffect, useState } from "react";
import { getEvents, searchEventsApi } from "../api/eventsApi";

function MapPage() {
  const [searchInput, setSearchInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadEvents() {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const q = searchInput.trim();
      const data = q ? await searchEventsApi(q) : await getEvents();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="map-page">
      <section className="map-layout">
        <aside className="map-sidebar">
          <div className="map-sidebar-inner">
            <div className="map-sidebar-header">
              <h1 className="fw-bold mb-3">
                Nearby Opportunities ({results.length})
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
              {loading && (
                <p className="text-secondary mb-0">Loading...</p>
              )}

              {error && (
                <p className="text-danger mb-0">{error}</p>
              )}

              {!loading && !error && results.length === 0 && (
                <p className="text-secondary mb-0">No nearby opportunities found.</p>
              )}

              {!loading && !error && results.map((event) => (
                <div key={event._id ?? event.eventId} className="map-result-card">
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
              ))}
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