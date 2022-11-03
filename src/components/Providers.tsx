import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const Providers = ({ providers, search, sort }: any) => {
  const url = `https://watch.borsethserver.online/Items?api_key=e2edd899b3a6480595a6f179835d1f73&userId=458c3e696e054e5c907b3bbfc230a89a&parentId=${
    sort === "movie"
      ? "f137a2dd21bbc1b99aa5c0f6bf02a805"
      : "a656b907eb3a73532e40e44b968d0225"
  }`;
  const { isLoading, error, data } = useQuery(["jellyfin"], () =>
    fetch(url).then((res) => res.json())
  );

  const [movie, setMovie] = useState<any>(null);
  const [found, setFound] = useState(false);

  useEffect(() => {
    setFound(false);
    search.map((movie: { title: string; id: number; release_date: string }) => {
      if (movie.id === providers.id) {
        setMovie(movie);
      }
    });
    if (!isLoading && movie) {
      console.log(data);
      data.Items.forEach((item: { UserData: { Key: number } }) => {
        if (movie.id === Number(item.UserData.Key)) {
          console.log("found in jellyfin");
          setFound(true);
        } else {
          console.log("no");
        }
      });
    }
  }, [data]);

  return (
    <div className="text-white h-full w-1/2 grid place-items-center">
      {movie && (
        <>
          <h1 className="text-2xl">{movie.title}</h1>
          {console.log(movie)}
          <span>
            "
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : new Date(movie.first_air_date).getFullYear()}
            "
          </span>
          <div>
            {found && (
              <h2 className="text-red-500 text-3xl bg-white rounded p-1">
                Movie is Available on borsethserver.online
              </h2>
            )}
            {providers.results.CA ? (
              <>
                {providers.results.CA.flatrate && (
                  <>
                    <h2 className="text-xl">Avaliable at</h2>
                    <ul className="mb-10">
                      {providers.results.CA.flatrate.map((provider: any) => {
                        return (
                          <li
                            key={provider.provider_id}
                            className="flex w-full justify-between"
                          >
                            {provider.provider_name}
                            <img
                              src={`https://image.tmdb.org/t/p/w500/${provider.logo_path}`}
                              alt=""
                              className="w-10 rounded-full"
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
                {providers.results.CA.buy && (
                  <>
                    <h2 className="text-xl">Avaliable for Purchase</h2>
                    <ul>
                      {providers.results.CA.buy.map((provider: any) => {
                        return (
                          <li
                            key={provider.provider_id}
                            className="flex w-full justify-between"
                          >
                            {provider.provider_name}
                            <img
                              src={`https://image.tmdb.org/t/p/w500/${provider.logo_path}`}
                              alt=""
                              className="w-10 rounded-full"
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </>
            ) : (
              <span>Not Available in Canada</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Providers;
