"use strict";

const matchPatterns = {
    "*://bitbucket.org/*/src/*.go?*": "(bitbucket.org/(?:[^/]+/){2})src/[^/]+/(.*?)/?[^/]+.go",
    "*://github.com/*/blob/*.go": "(github.com/(?:[^/]+/){2})blob/[^/]+/(.*?)/?[^/]+.go",
};

const matchRegExp = new RegExp(Object.values(matchPatterns).join("|"));

browser.pageAction.onClicked.addListener((tab) => {
    let url = new URL(tab.url),
        matches = (url.host + url.pathname).match(matchRegExp);

    matches.shift();

    browser.tabs.update(tab.id, {url: `https://godoc.org/${matches.join("")}`});
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!tab.active || tab.status != "complete") {
        return;
    }

    browser.pageAction.show(tab.id);
}, {
    urls: Object.keys(matchPatterns),
    properties: [
        "attention",
        "status",
    ],
});
