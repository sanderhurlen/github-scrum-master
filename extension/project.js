// ID: 12330564

/**
 * Promise that resolves after X milliseconds
 * @param {int} ms time in milliseconds
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Performs story point work on the backlog column
 *
 */
async function doStoryPointWork() {
  // We sleep 1 second to ensure cards are loaded and available
  await sleep(1000)
  // The ID of the column, found when inspecting the HTML element
  const columnId = 12330564
  const backlogColumn = document.getElementById(`column-${columnId}`)
  console.log(backlogColumn)
  /**
   * Add dragend listeners on all columns
   */
  document.querySelectorAll('.project-column').forEach((el) => {
    el.addEventListener('dragend', () => {
      setStoryPoints()
    })
  })

  /**
   * Calculates all story points in backlog column and return the
   * value: default return is 0
   */
  function getStoryPointsInBacklog() {
    let storyPoints = 0
    ;[].slice.call(backlogColumn.querySelectorAll('.IssueLabel')).forEach(function (label) {
      let labelText = label.innerText
      if (labelText.includes('point')) {
        storyPoints += Number.parseInt(labelText.split('point: ')[1])
      }
    })
    return storyPoints
  }

  const detailsContainer = backlogColumn.querySelector('.js-details-container')
  const counterElement = detailsContainer.querySelector('.js-column-card-count')
  /**
   * Register click handler on the counter label so we can manualy
   * recalculate story points.
   */
  counterElement.addEventListener('click', setStoryPoints)
  counterElement.addEventListener('mouseover', () => {
    counterElement.setAttribute('style', 'cursor: pointer;')
  })
  /**
   * Sets new story points text to the task counter label.
   * This task is delayed as we want to wait for GitHub updates
   * on the label (card count) before we do modifications.
   */
  async function setStoryPoints() {
    await sleep(500)
    let counter = counterElement.innerHTML.split('/')[0]
    let count = counter
    counterElement.innerHTML = `${count} / ${getStoryPointsInBacklog()}p`
  }
  setStoryPoints()
}

doStoryPointWork()
