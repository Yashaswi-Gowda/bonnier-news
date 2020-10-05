"use strict";
const feedList = require('./feeds.json');
const parseString = require('xml2js').parseString;
const request = require('request');

// Fetch the feed list from the url.
function fetchFeedFromSite(url) {
  return new Promise(function (resolve, reject) {
    request(url, (err, response, body) => {
      if (err) {
        console.log(err);
        resolve();
      }
      //convert to js object.
      return parseString(body, { explicitArray: false }, function (err, result) {
        // if contains result resolves.
        if (result) {
          resolve(result);
        }
        // if error, resolves.
        resolve();
      });
    });
  });
}

/*
  Get the feed from all feed source urls => merge => remove duplicates => sort => select top 10 news.
*/
async function getAllFeeds() {
  let feedRequests = getFeedList().feeds.map(feedSource => fetchFeedFromSite(feedSource));
  let rssFeeds = await Promise.all(feedRequests);
  return rssFeeds.filter(rssFeedResponse => rssFeedResponse) //Remove empty feed list.
    .flatMap(function (rssFeed) {
      if (rssFeed && rssFeed.rss && rssFeed.rss.channel) {
        return rssFeed.rss.channel.item;
      }
      return [];
    }).reduce((result, feed) => { //Remove duplicates from the list.
      if (!result.find(it => it.title === feed.title)) {
        result.push(feed);
      }
      return result;
    }, [])
    .sort((f1, f2) => new Date(f2.pubDate) - new Date(f1.pubDate)) //Sort the feed list.
    .slice(0, 10) // slice top 10. 
    .map(news => Object({ 'title': news.title, 'link': news.link }));
}

function getFeedList() {
  return feedList;
}

module.exports.getAllFeeds = getAllFeeds;
module.exports.getFeedList = getFeedList;