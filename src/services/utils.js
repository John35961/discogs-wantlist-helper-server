const formatReleasesFrom = (data) => {
  return data.results.map((result) => {
    return {
      id: result.id,
      title: result.title,
      thumb: result.thumb,
      uri: result.uri,
    }
  })
};

export { formatReleasesFrom };
