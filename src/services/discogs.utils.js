import config from '../config/index.config.js';

const FALLBACK_THUMB = `${config.appBaseUrl}/images/fallback_thumb.png`;

export const mapDiscogsUser = (user) => {
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

export const mapDiscogsReleaseDetails = (release) => {
  const artists = release.artists.map((artist) => { return artist.name });
  const formats = release.formats.map((format) => { return format.name });

  return {
    message: 'Added to wantlist',
    release: {
      title: release.title,
      artists: commaSeparated(artists),
      formats: commaSeparated(formats),
      year: release.year,
      uri: releaseUriFrom(release.id),
      thumb: release.thumb || FALLBACK_THUMB,
    }
  };
};

export const mapsDiscogsSearchResults = (results) => {
  return results.map((result) => {
    return {
      message: 'Want',
      release: {
        id: result.id,
        title: result.title,
        formats: commaSeparated(result.format),
        year: result.year,
        uri: releaseUriFrom(result.id),
        thumb: result.thumb || FALLBACK_THUMB,
      }
    };
  });
};

const commaSeparated = (items) => {
  return items.join(', ');
};

const releaseUriFrom = (releaseId) => {
  return `${config.discogsWebsiteBaseUrl}/release/${releaseId}`;
};
