function updateIconAndPopup(tab)
{
    checkThatBookmarkExistsInFavorites(tab.url, function(bookmarkExists)
    {
        var iconPath = bookmarkExists ? "icons/19.png" : "icons/bw19.png";
        chrome.pageAction.setIcon({path:iconPath, tabId:tab.id});

        var popupPath = bookmarkExists ? "popup-remove.html" : "popup.html";
        chrome.pageAction.setPopup({popup:popupPath, tabId:tab.id});
    });
}

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab)
{
    if (tab.url.match(/^http:\/\/music.yandex.ru/i) != null)
    {
        updateIconAndPopup(tab);
        chrome.pageAction.show(tabId);
    }
}

function onBookmarksChanged(id, bookmark)
{
    getCurrentTab(updateIconAndPopup);
}

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// listen to any changes in bookmarks
chrome.bookmarks.onCreated.addListener(onBookmarksChanged);
chrome.bookmarks.onRemoved.addListener(onBookmarksChanged);
chrome.bookmarks.onChanged.addListener(onBookmarksChanged);
chrome.bookmarks.onMoved.addListener(onBookmarksChanged);