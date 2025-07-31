import React, { useEffect, useState, useCallback, memo } from "react";
import "./TrendingSearches.css";
import axios from "axios";
import { backendHost } from "../../../api-config";
import { Link } from "react-router-dom";

const TrendingSearches = memo(({ items, onSelect }) => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrendingCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendHost}/data/all/trending/categories`,
        {
          headers: {
            "Cache-Control": "max-age=300", // Cache for 5 minutes
          },
        }
      );
      setTrending(data);
    } catch (err) {
      console.error("Error loading trending categories:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    (async () => {
      try {
        await fetchTrendingCategories();
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      }
    })();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [fetchTrendingCategories]);

  const createDiseaseSlug = (category) => {
    return `${category.dc_id}-${category.category.replace(/\s+/g, "-")}`;
  };

  if (error) {
    return (
      <section
        className="container trending-searches"
        aria-labelledby="trending-title"
      >
        <h2 id="trending-title" className="landing-page__title">
          Trending Searches
        </h2>
        <p className="ts-error" role="alert">
          Failed to load trending searches.
        </p>
      </section>
    );
  }

  return (
    <section
      className="container trending-searches"
      aria-labelledby="trending-title"
    >
      <h2 id="trending-title" className="landing-page__title">
        Trending Searches
      </h2>
      <div className="ts-list" role="list">
        {loading ? (
          <p className="ts-loading" aria-live="polite">
            Loading trending searches...
          </p>
        ) : (
          trending.map((category) => (
            <Link
              to={`/searchcategory/disease/${createDiseaseSlug(category)}`}
              key={category.dc_id}
              className="ts-link"
            >
              <button
                type="button"
                className="ts-pill"
                onClick={() => onSelect?.(category)}
                aria-label={`Search ${category.category} diseases`}
              >
                {category.category}
              </button>
            </Link>
          ))
        )}
      </div>
    </section>
  );
});

TrendingSearches.displayName = "TrendingSearches";

export default TrendingSearches;
