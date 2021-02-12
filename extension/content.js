/**
 * Function resolver for project sidebar element
 */
const project = () => document.getElementById('projects-select-menu').parentElement.parentElement

/**
 * Add reminder text over gutter, aka top of the page
 */
const gutter = document.querySelector('.gutter-condensed')
const message = 'Remember to set project!'
const messageHeader = document.createElement('h2')
messageHeader.setAttribute('style', 'color:#FF404F; text-align:center;')
messageHeader.innerText = message
gutter.querySelector('div').prepend(messageHeader)

/**
 * Form submit button
 */
const button = gutter.querySelector('.btn-primary')

/**
 * Time interval for checking if a project is selected.
 * Disables the submit button if no project is selected even
 * if form is valid.
 */
let hasSelectedProject = false
const interval = setInterval(() => {
  let containsNone = false
  project()
    .querySelector('.js-issue-sidebar-form')
    .childNodes.forEach((element) => {
      const innerText = element.innerText
      if (innerText) {
        if (innerText.toLowerCase().includes('none')) {
          containsNone = true
          return
        }
        containsNone = false
      }
    })

  if (containsNone) {
    hasSelectedProject = false
    if (!button.disabled) {
      button.disabled = true
    }
  } else {
    button.disabled = false
    hasSelectedProject = true
  }
}, 1000)

/**
 * traps enter event, so we cant submit the form before a project
 * is selected.
 */
document.addEventListener('keydown', (e) => {
  if (e.key == 'Enter' && !hasSelectedProject) {
    e.preventDefault()
  }
})

/**
 * Promise that resolves after X milliseconds
 * @param {int} ms time in milliseconds
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function openProjectMenu() {
  try {
    await sleep(200)
    project().querySelector('.js-issue-sidebar-form').querySelector('summary').click()
    // AUTO CLICKS FIRST PROJECT
    // await sleep(1200)
    // project()
    //   .querySelector('details-menu')
    //   .querySelector('.select-menu-list')
    //   .querySelector('.select-menu-item')
    //   .click()
  } catch (error) {
    console.warn('Could not find a project')
  }
}
openProjectMenu()
