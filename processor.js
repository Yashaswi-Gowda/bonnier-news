"use strict";
const feedList = require('./feeds.json');
const parseString = require('xml2js').parseString;
const request = require('request');

var rsscontentCache;
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

/*Get News title and link bases on key search*/
/*Input will be /news/search?kry=anysearchkey*/
async function getNews(searchKey) {
  let rssFeed = getFeedList().feeds.map(feedUrl => fetchFeedFromSite(feedUrl)); //11
  let rssContent = await Promise.all(rssFeed);//11 promises resolved all xml to jsobject
  return rssContent.flatMap(rssRoot => rssRoot.rss.channel.item) //[item1, item2, item3]
    .filter(item => (item.title.search(searchKey) > 0))
    .map(e => "title: " + e.title + " " + "link:" + e.link); //403 items 

}

/* Get latest one hour news */
async function getLatestHourNews() {
  var currentTime = new Date();
  currentTime.setHours(currentTime.getHours() - 1);
  let rssFeed = getFeedList().feeds.map(feedUrl => fetchFeedFromSite(feedUrl)); //11
  let rssContent = await Promise.all(rssFeed);//11 promises resolved all xml to jsobject
  return rssContent.flatMap(rssRoot => rssRoot.rss.channel.item) //[item1, item2, item3]
    .filter(item => (new Date(item.pubDate) > currentTime));
  // .map(e => "title: "+ e.title +" " + "link:" +e.link); //403 items
}

function getFeedList() {
  return feedList;
}

/*getAllFeeds() function can write without async and await, bcz await tmay reduce
the performance when there is a heavy load */
/*function getAllFeeds() {
  let feedRequests = getFeedList().feeds.map(feedSource => fetchFeedFromSite(feedSource));
  return Promise.all(feedRequests).then(function(result) {
    return result.filter(rssFeedResponse => rssFeedResponse) //Remove empty feed list.
    .flatMap(function (rssFeed) {
      if (rssFeed && rssFeed.rss && rssFeed.rss.channel) {
        return rssFeed.rss.channel.item;
      }
      return [];
    }).reduce((result, feed) => { //Remove duplicates from the list.
      if (!result.find(it => it.guid === feed.guid)) {
        result.push(feed);
      }
      return result;
    }, [])
    .sort((f1, f2) => new Date(f2.pubDate) - new Date(f1.pubDate))
    .map(news => Object({ 'title': news.title, 'link': news.link, 'description': news.description }));
  });
} */

/*Caching the rssFeed content*/
setTimeout(getFeedContent, 10000);
var rssFeeds;
function getFeedContent() {
  if (!rssFeeds) {
    let feedRequests = getFeedList().feeds.map(feedSource => fetchFeedFromSite(feedSource));
    let rssFeeds = Promise.all(feedRequests).then(function (result) {
      rssFeeds = result;
      return result;
    });

  }
}
/*getAllFeeds method when caching the rssFeed*/
/*
async function getAllFeeds() {
  return getFeedContent().filter(rssFeedResponse => rssFeedResponse) //Remove empty feed list.
    .flatMap(function (rssFeed) {
      if (rssFeed && rssFeed.rss && rssFeed.rss.channel) {
        return rssFeed.rss.channel.item;
      }
      return [];
    }).reduce((result, feed) => { //Remove duplicates from the list.
      if (!result.find(it => it.guid === feed.guid)) {
        result.push(feed);
      }
      return result;
    }, [])
    .sort((f1, f2) => new Date(f2.pubDate) - new Date(f1.pubDate))
    .map(news => Object({ 'title': news.title, 'link': news.link, 'description': news.description }));
  return;
}
*/
/*To improve performance can cache the output and then set the time interval*/

module.exports.getAllFeeds = getAllFeeds;
module.exports.getFeedList = getFeedList;
module.exports.getNews = getNews;
module.exports.getLatestHourNews = getLatestHourNews;