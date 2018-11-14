const DomReady = require('domready');
const GhostContentApi = require('@tryghost/content-api');
const GhostMembersLayer2 = require('@tryghost/members-layer2');

const fetchAndLoadContent = (hostUrl, postId, token) => {
    const postContentDiv = document.querySelector('[data-members-drop-in-resource');
    if (!postContentDiv) {
        return;
    }
    const api = GhostContentApi.create({
        host: hostUrl,
        version: 'v2',
        key: ''
    });

    api.posts.read({ id: postId }, {}, token).then((post) => {
        postContentDiv.innerHTML = post.html;
        console.info('Inserted post data from content API', post);
    }).catch((err) => {
        console.error("Failed to fetch data from content API", err);
    });
};


const init = (blogUrl, postId) => {
    let hostUrl = `${blogUrl}/ghost`;
    GhostMembersLayer2.init({reload: true}).then(({ getToken }) => {
        getToken().then((token) => {
            if (token) {
                fetchAndLoadContent(hostUrl, postId, token);
            }
        })
    });
}

DomReady(function () {
    let dataObject = document.querySelector('[data-members-drop-in-resource');
    let blogUrl = dataObject && dataObject.getAttribute('data-members-blog-url');
    let postId = dataObject && dataObject.getAttribute('data-members-resource-id');
    if (blogUrl && postId) {
        init(blogUrl, postId);
    } else {
        GhostMembersLayer2.init({reload: true});
    }
});

console.info("Initialized members script...");

export default {
    init: init
}