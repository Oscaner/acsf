'use strict';

const got = require('got');
const utilAuth = require('../utils/auth');

module.exports = {
  getSites: async (apiEndpoint, username, password) => {
    const result = await got.get(apiEndpoint + '/sites', {
      searchParams: {
        limit: 1000,
      },
      headers: {
        Authorization: utilAuth.generateAuth(username, password),
      },
      responseType: 'json',
    });

    const sites = result.body.sites;

    if (!sites) {
      return {};
    }

    const formattedSites = {};

    sites.map((site) => {
      formattedSites[site.site] = site;
    });

    return formattedSites;
  },

  getCollections: async (apiEndpoint, username, password) => {
    const result = await got.get(apiEndpoint + '/collections', {
      searchParams: {
        limit: 100,
      },
      headers: {
        Authorization: utilAuth.generateAuth(username, password),
      },
      responseType: 'json',
    });

    const collections = result.body.collections;

    if (!collections) {
      return {};
    }

    const sites = {};

    collections.map((collection) => {
      sites[collection.name] = collection;
    });

    return sites;
  },

  getDomains: async (apiEndpoint, username, password, siteId) => {
    const result = await got.get(apiEndpoint + '/domains/' + siteId, {
      searchParams: {
        limit: 100,
      },
      headers: {
        Authorization: utilAuth.generateAuth(username, password),
      },
      responseType: 'json',
    });

    const domains = result.body.domains;

    if (!domains) {
      return {};
    }

    return domains;
  },

  getVCS: async (apiEndpoint, username, password, type) => {
    const result = await got.get(apiEndpoint + '/vcs?type=' + type, {
      headers: {
        Authorization: utilAuth.generateAuth(username, password),
      },
      responseType: 'json',
    });

    const available = result.body.available;

    if (!available) {
      return {};
    }

    return available;
  },

  addDomain: async (apiEndpoint, username, password, siteId, domain) => {
    const result = await got.post(apiEndpoint + '/domains/' + siteId + '/add', {
      json: {
        domain_name: domain,
      },
      headers: {
        Authorization: utilAuth.generateAuth(username, password),
      },
      responseType: 'json',
    });

    return result;
  },

  removeDomain: async (apiEndpoint, username, password, siteId, domain) => {
    const result = await got.post(apiEndpoint + '/domains/' + siteId + '/remove', {
      json: {
        domain_name: domain,
      },
      headers: {
        Authorization: utilAuth.generateAuth(username, password),
      },
      responseType: 'json',
    });

    return result;
  },

  cacheClear: (apiEndpoint, username, password, siteId) => {
    return got.post(apiEndpoint + '/sites/' + siteId + '/cache-clear', {
      headers: {
        Authorization: utilAuth.generateAuth(username, password),
      },
      responseType: 'json',
    });
  },

  staging: (apiEndpoint, username, password, toEnv, siteIds, wipe) => {
    return got.post(apiEndpoint + '/stage', {
      json: {
        to_env: toEnv,
        sites: siteIds,
        wipe_target_environment: wipe,
        synchronize_all_users: true,
        detailed_status: true,
      },
      headers: {
        Authorization: utilAuth.generateAuth(username, password),
      },
      responseType: 'json',
    });
  },

  update: (apiEndpoint, username, password, vcsRef, updateType) => {
    return got.post(apiEndpoint + '/update', {
      json: {
        scope: 'sites',
        sites_ref: vcsRef,
        sites_type: updateType,
      },
      headers: {
        Authorization: utilAuth.generateAuth(username, password),
      },
      responseType: 'json',
    });
  },

};
