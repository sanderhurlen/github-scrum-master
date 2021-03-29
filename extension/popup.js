console.log('hi');

const detailsToggle = document.querySelector('#details-toggle');

chrome.storage.sync.get(['detailsHidden'], (result) => {
    detailsToggle.checked = result.detailsHidden;
});

detailsToggle.addEventListener('change', (e) => {
    const value = e.target.checked;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { details: value },
            function (response) {
                console.log(response.success);
            }
        );
    });
});
