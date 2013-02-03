ROOT_FAVORITES_FOLDER = 'Яндекс.Музыка Избранное';

function getCurrentTab(callback)
{
    chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function (tabArray)
    {
        tab = tabArray[0];
        callback(tab);
    });
}

function checkGrandparent(node, callback)
{
    chrome.bookmarks.get(node.parentId, function(parentArray)
    {
        chrome.bookmarks.get(parentArray[0].parentId, function(grandparentArray)
        {
            callback(grandparentArray[0].title == ROOT_FAVORITES_FOLDER);
        });
    });
}

function checkThatBookmarkExistsInFavorites(url, callback)
{
    chrome.bookmarks.search(url, function (nodes)
    {
        for (i = 0; i < nodes.length; ++i) 
        {
            if (nodes[i].url == url)
            {
                checkGrandparent(nodes[i], callback);
                // TODO don't return but check for grandparent all items with equal rule
                // TODO since in general case there may be e.g. one bookmark inside our favorites and the other outside with the same url
                return;
            }
        }
        callback(false);
    });
}

function findBookmarkByUrl(url, callback)
{
    chrome.bookmarks.search(url, function (nodes)
    {
        for (i = 0; i < nodes.length; ++i) 
        {
            if (nodes[i].url == url)
            {
                callback(nodes[i]);
                return;
            }
        }
        callback(null);
    });
}