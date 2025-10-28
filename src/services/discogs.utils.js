import config from '../config/index.config.js';

const FALLBACK_THUMB = `${config.appBaseUrl}/images/fallback_thumb.png`;

export const formatUserFrom = (data) => {
  const user = data;

  return {
    user: {
      name: user.name || user.username,
      avatar_url: user.avatar_url,
      num_collection: user.num_collection,
      num_wantlist: user.num_wantlist,
      uri: user.uri,
    }
  };
};

export const formatReleaseFrom = (data) => {
  const release = data.basic_information;

  return {
    message: 'Added to wantlist',
    release: {
      title: release.title,
      artists: parseArtists(release.artists),
      thumb: release.thumb || FALLBACK_THUMB,
      year: release.year,
      uri: releaseUriFrom(release.id),
    }
  };
};

export const formatReleasesFrom = (data) => {
  return data.results.map((result) => {
    return {
      message: 'Want',
      release: {
        id: result.id,
        title: result.title,
        styles: parseStyles(result.style),
        thumb: result.thumb || FALLBACK_THUMB,
        year: result.year,
        uri: releaseUriFrom(result.id),
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

const releaseUriFrom = (releaseId) => {
  return `${config.discogsWebsiteBaseUrl}/release/${releaseId}`;
};
