"use strict";

const matchPatterns = {
    "*://bitbucket.org/*": "(bitbucket.org/(?:[^/]+/){2})src/[^/]+/(.*?)/?[^/]+.go",
    "*://github.com/*": "(github.com/(?:[^/]+/){2})blob/[^/]+/(.*?)/?[^/]+.go",
};

const matchRegExp = new RegExp(Object.values(matchPatterns).join("|"));

browser.pageAction.onClicked.addListener((tab) => {
    let url = new URL(tab.url),
        matches = (url.host + url.pathname).match(matchRegExp);

    matches.shift();

    browser.tabs.update(tab.id, {url: `https://godoc.org/${matches.join("")}`});
});

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.url) {
        let match = new URL(changeInfo.url).pathname.endsWith(".go")
        if (match) {
            browser.pageAction.show(tabId);
        } else {
            browser.pageAction.hide(tabId);
        }
    } else if (changeInfo.status == "loading") {
        browser.pageAction.hide(tabId);
    }
}, {
    urls: Object.keys(matchPatterns),
    properties: [
        "attention",
        "status",
    ],
});
