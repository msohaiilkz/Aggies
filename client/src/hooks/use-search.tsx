import { createContext, useContext, useState, type ReactNode } from "react";

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  placeholder: string;
  // Calling setPlaceholder marks the current page as searchable, so the
  // top-bar search box only appears on pages that actually consume it.
  setPlaceholder: (p: string) => void;
  searchable: boolean;
}

const SearchContext = createContext<SearchContextValue | null>(null);

// Provides a page-scoped search query. Because each page mounts its own
// MainLayout (and therefore its own provider), the top-bar search filters only
// the current page's content and resets automatically when you switch pages.
export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholderState] = useState("Search...");
  const [searchable, setSearchable] = useState(false);

  const setPlaceholder = (p: string) => {
    setPlaceholderState(p);
    setSearchable(true);
  };

  return (
    <SearchContext.Provider
      value={{ query, setQuery, placeholder, setPlaceholder, searchable }}
    >
      {children}
    </SearchContext.Provider>
  );
}

const NOOP = () => {};

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  // Safe fallback if used outside a provider.
  if (!ctx) {
    return {
      query: "",
      setQuery: NOOP,
      placeholder: "Search...",
      setPlaceholder: NOOP,
      searchable: false,
    };
  }
  return ctx;
}
