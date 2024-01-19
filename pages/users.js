// serves as a UI for testing the mongodb connection

import useSWR from "swr";

export default function users() {

  // fetcher strategy
  const fetcher = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  // fetch the data using swr
  const { data, error } = useSWR("api/debug", fetcher);

  if (error) return <div>{error.toString()}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <>
        {data.map(user => (
            <p>{user.id}</p>
        ))}
    </>
  );
}