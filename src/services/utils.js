const formatReleasesFrom = (data) => {
  return data.results.map((result) => {
    return {
      id: result.id,
      title: result.title,
      thumb: result.thumb,
      uri: `https://discogs.com/release/${result.id}`,
      year: result.year,
    }
  })
};

export { formatReleasesFrom };
