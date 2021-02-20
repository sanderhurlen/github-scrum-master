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
  // We sleep 2 second to ensure cards are loaded and available
  await sleep(2000)
  const darkMode = document.documentElement.dataset['colorMode'] == 'dark' ? true : false

  // The ID of the column, found when inspecting the HTML element
  const sprintBacklogId = 12330564
  const sprintInProgressId = 12330525
  const sprintReadyForReviewId = 12426330

  const columnsContainer = document.querySelector('.project-columns')
  const backlogColumn = document.getElementById(`column-${sprintBacklogId}`)
  const sprintInProgressColumn = document.getElementById(`column-${sprintInProgressId}`)
  const sprintReadyForReviewColumn = document.getElementById(`column-${sprintReadyForReviewId}`)

  // All assigness in backlog, inprogress and ready for review
  let assignees = {}

  let boardDetailsElement
  function createBoardDetailsMarkup() {
    boardDetailsElement = document.createElement('div')
    boardDetailsElement.id = 'board-details'
    columnsContainer.prepend(boardDetailsElement)
  }
  function updateAssigneePoints() {
    for (const username in assignees) {
      if (Object.hasOwnProperty.call(assignees, username)) {
        const assignee = assignees[username]
        console.log(assignee['points'])
        document.getElementById(`${username}-${backlog}`).innerText = assignee['points'][backlog]
        document.getElementById(`${username}-${progress}`).innerText = assignee['points'][progress]
        document.getElementById(`${username}-${review}`).innerText = assignee['points'][review]
      }
    }
  }
  function addAssignessToDetails() {
    for (const username in assignees) {
      if (Object.hasOwnProperty.call(assignees, username)) {
        const assignee = assignees[username]

        const assigneeCard = document.createElement('div')
        assigneeCard.classList.add('ghm-assignee-card')
        if (darkMode) assigneeCard.classList.add('dark')
        const assigneeTitle = document.createElement('div')
        assigneeTitle.classList.add('ghm-assignee-card-title')
        assigneeTitle.append(assignee['avatar'])
        assigneeTitle.innerHTML += `<br> ${username}`

        const assigneeList = document.createElement('ul')
        assigneeList.classList.add('ghm-assignee-point-list')

        const assigneeListItem = document.createElement('li')

        const columnName = document.createElement('span')
        columnName.classList.add('ghm-is-bold')
        const columnText = document.createElement('span')

        const backlogListItem = assigneeListItem.cloneNode()
        const backlogTextName = columnName.cloneNode()
        const backlogTextPoints = columnText.cloneNode()
        backlogTextPoints.id = `${username}-${backlog}`
        backlogTextName.innerHTML = 'Backlog: '
        backlogListItem.appendChild(backlogTextName)
        backlogTextPoints.innerHTML = assignee['points'][backlog]
        backlogListItem.appendChild(backlogTextPoints)

        const progressListItem = assigneeListItem.cloneNode()
        const progressTextName = columnName.cloneNode()
        const progressTextPoints = columnText.cloneNode()
        progressTextPoints.id = `${username}-${progress}`
        progressTextName.innerHTML = 'Progress: '
        progressListItem.appendChild(progressTextName)
        progressTextPoints.innerHTML = assignee['points'][progress]
        progressListItem.appendChild(progressTextPoints)

        const reviewListItem = assigneeListItem.cloneNode()
        const reviewTextName = columnName.cloneNode()
        const reviewTextPoints = columnText.cloneNode()
        reviewTextPoints.id = `${username}-${review}`
        reviewTextName.innerHTML = 'Review: '
        reviewListItem.appendChild(reviewTextName)
        reviewTextPoints.innerHTML = assignee['points'][review]
        reviewListItem.appendChild(reviewTextPoints)

        assigneeList.append(backlogListItem, progressListItem, reviewListItem)
        assigneeCard.append(assigneeTitle)
        assigneeCard.append(assigneeList)

        boardDetailsElement.append(assigneeCard)
      }
    }
  }

  /**
   * Add dragend listeners on all columns
   */
  document.querySelectorAll('.project-column').forEach((el) => {
    el.addEventListener('dragend', async () => {
      await setStoryPoints()
      clearAssigneePoints()
      setAllAssigneePoints()
      updateAssigneePoints()
    })
  })

  const backlog = 'backlog'
  const progress = 'progress'
  const review = 'review'

  function clearAssigneePoints() {
    for (const key in assignees) {
      if (Object.hasOwnProperty.call(assignees, key)) {
        assignees[key]['points'] = {
          backlog: 0,
          progress: 0,
          review: 0
        }
      }
    }
  }

  function createAssigneeIfNotExists(name, avatar) {
    if (assignees[name]) return
    assignees[name] = {
      points: {
        backlog: 0,
        progress: 0,
        review: 0
      },
      avatar
    }
  }

  function setStoryPointsAssigneesForColumn(column, columnCards) {
    for (const card of columnCards) {
      let pointsInCard = getStoryPointsFromElement(card)
      const avatars = card.querySelectorAll('.AvatarStack button')
      const numAssigness = avatars.length
      if (numAssigness > 1) {
        pointsInCard = Math.ceil(pointsInCard / numAssigness)
      }
      for (const avatar of avatars) {
        const assignee = avatar.querySelector('img').alt
        createAssigneeIfNotExists(assignee, avatar.cloneNode(true))
        assignees[assignee]['points'][column] += pointsInCard
      }
    }
  }
  async function setAllAssigneePoints() {
    const backlogCards = backlogColumn.querySelectorAll('article')
    const progressCards = sprintInProgressColumn.querySelectorAll('article')
    const reviewCards = sprintReadyForReviewColumn.querySelectorAll('article')

    setStoryPointsAssigneesForColumn(backlog, backlogCards)
    setStoryPointsAssigneesForColumn(progress, progressCards)
    setStoryPointsAssigneesForColumn(review, reviewCards)
  }

  /**
   * Get all story points labels from the provided element, it can be a document, column, or card
   * from the board. If it doesnt find any point label, 0 is returned
   * @param fromElement element to get story points from
   */
  function getStoryPointsFromElement(fromElement) {
    let storyPoints = 0
    ;[].slice.call(fromElement.querySelectorAll('.IssueLabel')).forEach(function (label) {
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
    counterElement.innerHTML = `${count} / ${getStoryPointsFromElement(backlogColumn)}p`
  }
  createBoardDetailsMarkup()
  await setStoryPoints()
  setAllAssigneePoints()
  addAssignessToDetails()
}

doStoryPointWork()
