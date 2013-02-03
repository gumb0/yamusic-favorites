function updateIcon(tab)
{
    checkThatBookmarkExistsInFavorites(tab.url, function(bookmarkExists)
    {
        iconPath = bookmarkExists ? "icons/19.png" : "icons/bw19.png";

        chrome.pageAction.setIcon({path:iconPath, tabId:tab.id});
    });
}

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab)
{
    if (tab.url.match(/^http:\/\/music.yandex.ru/i) != null)
    {
        updateIcon(tab);
        chrome.pageAction.show(tabId);
    }
}

function onBookmarksChanged(id, bookmark)
{
    getCurrentTab(updateIcon);
}

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// listen to any changes in bookmarks
chrome.bookmarks.onCreated.addListener(onBookmarksChanged);
chrome.bookmarks.onRemoved.addListener(onBookmarksChanged);
chrome.bookmarks.onChanged.addListener(onBookmarksChanged);
chrome.bookmarks.onMoved.addListener(onBookmarksChanged);