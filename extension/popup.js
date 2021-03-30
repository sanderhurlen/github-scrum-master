const detailsToggle = document.querySelector('#details-toggle');
const updateBtn = document.querySelector('#update-settings');

/** Select for project columns */
const sprint = document.querySelector('#sprint-column');
const inprogress = document.querySelector('#inprogress-column');
const readyForReview = document.querySelector('#readyForReview-column');

function createOption(text, value) {
    const opt = document.createElement('option');
    opt.text = text;
    opt.value = value;
    return opt;
}

function fillInOptions(arr) {
    for (const dataId of arr) {
        sprint.add(createOption(dataId, dataId));
        inprogress.add(createOption(dataId, dataId));
        readyForReview.add(createOption(dataId, dataId));
    }
}

chrome.storage.local.get(['columns'], function (data) {
    if (data.columns) {
        fillInOptions(data.columns);
    }
});
/**
 * Fetches data from storage, if set, and appends it to the required settings
 */
chrome.storage.sync.get(['detailsHidden', 'pointColumns'], (result) => {
    detailsToggle.checked = result.detailsHidden;
    sprint.value = result.pointColumns[0];
    inprogress.value = result.pointColumns[1];
    readyForReview.value = result.pointColumns[2];
});

/**
 * Persist a key with value to the chrome storage
 * @param {{key: val}} obj
 */
function persist(obj) {
    chrome.storage.sync.set({ ...obj });
}

/**
 * add event listeners
 */
// update settings
updateBtn.addEventListener('click', (e) => {
    const value = detailsToggle.checked;
    persist({
        pointColumns: [sprint.value, inprogress.value, readyForReview.value],
        detailsHidden: value,
    });
});
