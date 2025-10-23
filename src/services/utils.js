import config from '../config/index.js';

const formatReleaseFrom = (data) => {
  const release = data.basic_information;

  return {
    message: 'Added to wantlist',
    release: {
      title: release.title,
      artists: parseArtists(release.artists),
      thumb: release.thumb,
      year: release.year,
      uri: `${config.discogsWebsiteBaseUrl}/release/${release.id}`,
    }
  };
};

const formatReleasesFrom = (data) => {
  return data.results.map((result) => {
    return {
      message: 'Want',
      release: {
        id: result.id,
        title: result.title,
        styles: parseStyles(result.style),
        thumb: result.thumb,
        year: result.year,
        uri: `${config.discogsWebsiteBaseUrl}/release/${result.id}`,
      }
    };
  });
};

const parseArtists = (artists) => {
  return artists.map((artist) => { return artist.name }).join(', ');
};

const parseStyles = (styles) => {
  return styles.join(', ');
};

export { formatReleaseFrom, formatReleasesFrom };
