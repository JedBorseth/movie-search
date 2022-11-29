import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, FormEvent } from "react";
import Providers from "./components/Providers";
function App() {
  const [sort, setSort] = useState("movie");
  const [search, setSearch] = useState(null);
  useEffect(() => {
    addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setSearch(null);
      }
    });
  }, []);
  return (
    <div className="w-full h-screen grid place-items-center bg-neutral-800 grid-rows-3">
      <h1 className="text-white text-2xl decoration-blue-600 text-center">
        Search Movies And TV Shows
        <span className="block text-center text-xs text-gray-200 italic">
          Searching my personal media server & TMDB and shows where to order,
          buy, or how to watch them
        </span>
      </h1>
      {search ? (
        <Results search={search} setSearch={setSearch} sort={sort} />
      ) : (
        <Form search={search} setSearch={setSearch} sort={sort} />
      )}
      {search && (
        <div
          className="text-white absolute top-0 right-0 w-20 h-20 border grid place-items-center cursor-pointer"
          onClick={() => {
            location.reload();
          }}
        >
          New Search
        </div>
      )}
      {!search && (
        <div
          className="text-white p-10 bg-neutral-600 rounded-xl hover:bg-neutral-700 hover:scale-105"
          onClick={() => {
            if (sort === "movie") {
              setSort("tv");
            } else {
              setSort("movie");
            }
          }}
        >
          Toggle {sort} Search
        </div>
      )}
    </div>
  );
}

export default App;
type props = {
  search: String | null;
  setSearch: Function;
  sort: string | null;
};
const Form = ({ search, setSearch, sort }: props) => {
  return (
    <form
      action="#"
      className="w-1/2 grid place-items-center"
      onSubmit={(e: any) => {
        e.preventDefault();
        if ((e.target[0] as HTMLInputElement).value) {
          setSearch((e.target[0] as HTMLInputElement).value);
        }
      }}
    >
      <input
        type="text"
        autoFocus
        className="rounded-md w-full text-center h-10"
        placeholder={`Search ${sort === "movie" ? "Movies" : "TV Shows"}...`}
      />
      <input
        type="submit"
        value="Go"
        className="bg-white w-1/2 rounded-md mt-5 hover:ring-blue-600 hover:rounded-none ring-4 transition-all"
      />
    </form>
  );
};

const Results = ({ search, setSearch, sort }: props) => {
  const [providers, setProviders] = useState<object | null>(null);

  const url = `https://api.themoviedb.org/3/search/${sort}/?api_key=3e377c1f356a2442895502b892470a0b&language=en-US&query=${search}&include_adult=false`;
  const { isLoading, error, data } = useQuery(["search"], () =>
    fetch(url).then((res) => res.json())
  );

  const getProviders = (movieId: number) => {
    fetch(
      `https://api.themoviedb.org/3/${sort}/${movieId}/watch/providers?api_key=3e377c1f356a2442895502b892470a0b`
    ).then((res) => {
      res.json().then((res) => {
        setProviders(res);
      });
    });
  };
  return (
    <>
      <div className="absolute top-0 left-0"></div>
      {providers ? (
        <Providers providers={providers} search={data.results} sort={sort} />
      ) : (
        <div className="h-[33em] overflow-auto hide-scrollbar w-full">
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              {data.results.length <= 0 ? (
                <div className="text-center text-white">No Results Found</div>
              ) : (
                data.results.map(
                  (movie: { id: number; title: string; name: string }) => {
                    return (
                      <div
                        key={movie.id}
                        className="w-full h-8 cursor-pointer relative hover:text-white text-center text-neutral-600 hover:underline decoration-blue-600 underline-offset-8"
                        onClick={() => {
                          getProviders(movie.id);
                        }}
                      >
                        {movie.title ? movie.title : movie.name}
                      </div>
                    );
                  }
                )
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};
