const formatReleaseFrom = (data) => {
  const release = data.basic_information;

  return {
    message: 'Added to wantlist',
    release: {
      title: release.title,
      thumb: release.thumb,
      artists: parseArtists(release.artists),
      uri: `https://discogs.com/release/${release.id}`,
      year: release.year,
    }
  };
};

const formatReleasesFrom = (data) => {
  return data.results.map((result) => {
    return {
      message: 'Add',
      release: {
        id: result.id,
        title: result.title,
        thumb: result.thumb,
        uri: `https://discogs.com/release/${result.id}`,
        year: result.year,
      }
    };
  });
};

const parseArtists = (artists) => {
  return artists.map((artist) => { return artist.name }).join(', ');
};

export { formatReleaseFrom, formatReleasesFrom, parseArtists };
