function showMessage(message, tooltip)
{
    document.getElementById("resultText").innerHTML = '<div title="' + tooltip + '">' + message + '</div>';
}

function showMessageWithButton(message, handler)
{
    document.getElementById("resultText").innerHTML = message;
    document.getElementById("btn").addEventListener('click', handler);
}

function addBookmark(favoritesNode, subfolderName, title, url)
{
    getChildFolder(favoritesNode, subfolderName, function (subfolderNode) 
    {
        chrome.bookmarks.create({'parentId': subfolderNode.id, 'title': title, 'url': url});
        window.close();
    });
}

function removeBookmark(bookmarkId)
{
    chrome.bookmarks.remove(bookmarkId);
    window.close();
}

function addBookmarkIfNotExists(favoritesNode, subfolderName, title, url)
{
    // don't add if it already exists (maybe outside of our favorites)
    findBookmarkByUrl(url, function(bookmark)
    {
        if (bookmark != null)
        {
            showMessage(title, title + ' уже существует в закладках, не могу добавить в Избранное :-(');
        }
        else
        {
            showMessageWithButton(title, function() { addBookmark(favoritesNode, subfolderName, title, url); });
        }
    });
}

function addArtistBookmark(favoritesNode, title, url)
{
    artistName = title.replace(/^(.+) на Яндекс.Музыке$/, '$1');
    addBookmarkIfNotExists(favoritesNode, FAVORITE_ARTISTS_FOLDER, artistName, url);
}

function addAlbumBookmark(favoritesNode, title, url)
{
    albumName = title.replace(/^Альбом «(.+)» исполнителя (.+) на Яндекс.Музыке$/, '$2 — $1');
    addBookmarkIfNotExists(favoritesNode, FAVORITE_ALBUMS_FOLDER, albumName, url);
}

function addTrackBookmark(favoritesNode, title, url)
{
    trackName = title.replace(/^«(.+)» из альбома «(.+)» исполнителя (.+) на Яндекс.Музыке$/, '$3 — $1');
    addBookmarkIfNotExists(favoritesNode, FAVORITE_TRACKS_FOLDER, trackName, url);
}

function saveTabToBookmarks(favoritesNode, tab)
{
    url = tab.url;
    if (url.match(/^http:\/\/music.yandex.ru\/#!\/artist\/\d+$/i))
        addArtistBookmark(favoritesNode, tab.title, url);
    else if (url.match(/^http:\/\/music.yandex.ru\/#!\/album\/\d+$/i))
        addAlbumBookmark(favoritesNode, tab.title, url);
    else if (url.match(/^http:\/\/music.yandex.ru\/#!\/track\/\d+\/album\/\d+$/i))
        addTrackBookmark(favoritesNode, tab.title, url);
    else
        showMessage('Чтобы добавить в Избранное, перейдите на страницу исполнителя, альбома или трека.', '');
}

function handleCurrentTab(favoritesNode)
{
    getCurrentTab(function (tab)
    {
        checkThatBookmarkExistsInFavorites(tab.url, function(bookmarkExists)
        {
            if (bookmarkExists)
            {
                findBookmarkByUrl(tab.url, function(bookmark)
                {
                    // assuming it is always found here
                    showMessageWithButton(bookmark.title, function() { removeBookmark(bookmark.id); })
                });
            }
            else
            {
                saveTabToBookmarks(favoritesNode, tab);
            }
        });
    });
}

getFavoritesFolder(handleCurrentTab);
