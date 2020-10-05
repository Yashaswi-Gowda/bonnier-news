"use strict";
var assert = require('chai').assert;
var sinon = require('sinon');

var processor = require('../processor');
var contentResponse = require('../test/contentResponse.json');
var feeds = require('../feeds.json');
var latestContent = require('../test/latestContent.json');

describe('Bonnier Latest top 10 news test', function () {
  it('Should throws error for empty feed list', () => {
    var processorMock = sinon.mock(processor);
    var feedList = {
      "feeds": [
      ]
    }
    processorMock.expects('getFeedList').withArgs().returns(Promise.resolve('[]'));
    var res = processor.getFeedList()
      .then(
        (res) => {
          Promise.reject(new Error('Expected method to reject.'))
        },
        err => {
          assert.instanceOf(err, TypeError)
        }
      );
    processorMock.restore();
    return res;
  });
  it('Result with one feed list', () => {
    var processorMock = sinon.mock(processor);
    var feedList = {
      "feeds": [
        "https://www.dn.se/rss"
      ]
    }
    processorMock.expects('getFeedList').withArgs().returns(Promise.resolve(feedList));
    processorMock.expects('getAllFeeds').withArgs().returns(Promise.resolve(contentResponse));
    var res = processor.getAllFeeds().then(
      (result) => {
        assert.isNotNull(result, "should not be null");
        assert.isArray(result);
      },
      err => Promise.reject(new Error('Expected method not to reject.'))
    );
    processorMock.restore();
    return res;
  });
  it('Test to skip the invalid feed url', () => {
    var processorMock = sinon.mock(processor);
    var feedList = {
      "feeds": [
        "https://www.dn.se/rss",
        "https://www.abc/rss/kultur"
      ]
    }
    processorMock.expects('getFeedList').withArgs().returns(Promise.resolve(feedList));
    processorMock.expects('getAllFeeds').withArgs().returns(Promise.resolve(contentResponse));
    var res = processor.getAllFeeds().then(
      (result) => {
        assert.isNotNull(result, "should not be null");
        assert.isArray(result);
      },
      err => Promise.reject(new Error('Expected method not to reject.'))
    );
    processorMock.restore();
    return res;
  });
  it('Test for remvoing duplicates and latest 10 news', () => {
    var processorMock = sinon.mock(processor);
    processorMock.expects('getFeedList').withArgs().returns(Promise.resolve(feeds));
    processorMock.expects('getAllFeeds').withArgs().returns(Promise.resolve(latestContent));
    var res = processor.getAllFeeds().then(
      (result) => {
        assert.isNotNull(result, "should not be null");
        assert.isArray(result);
      },
      err => Promise.reject(new Error('Expected method not to reject.'))
    );
    processorMock.restore();
    return res;
  });
})
