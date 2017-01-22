// Wrapper for XHR requests
function request(options, callback) {
  const xhr = new XMLHttpRequest()
  xhr.open(options.verb, options.url, true)
  xhr.onload = function() {
    callback(xhr.status, xhr.responseText, xhr)
  }
  xhr.send()
}

// Helper function to create an HTML element
function createElement(tagName, innerText, attributes) {
  tagName = tagName || 'div'
  attributes = attributes || {}
  innerText = innerText || ''
  const ele = document.createElement(tagName)
  ele.innerText = innerText
  Object.keys(attributes).forEach(function(attribute) {
    if (attribute == 'class') {
      ele.classList.add(attributes[attribute])
    } else {
      ele[attribute] = attributes[attribute]
    }
  })
  console.log(ele)
  return ele
}

// Creates the 'product link', which is a list item with an anchor and button inside
function createProductLink(name, link) {
  const listItem = createElement('li')
  const anchor = createElement(
    'a',
    name,
    {
      href: link,
      target: '_blank',
      'class': 'result'
    })
  const button = createElement(
    'button',
    'Copy',
    {
      'class': 'action'
    }
  )
  listItem.appendChild(anchor)
  listItem.appendChild(button)
  return listItem
}

// We'll need this element later
const $results = document.querySelector('#results')

// Add the event listener to the seach box
document.querySelector('#search').addEventListener('input', function() {
  if (this.value.length > 1) { // Only search if user has input more than one character
    console.log('Starting request...')
    request({
      url: 'https://pcpartpicker.com/search/?live=1&q='+this.value+'&qid=1',
      verb: 'GET'
    }, function(status, response, xhr) {
      console.log(xhr)
      try {
        if (status === 200) {
          $results.innerHTML = '' // Clear current results
          response = JSON.parse(response) // Convert response to object
          response.results.forEach(function(componentData) { // For every result (which should be a computer component)
            $results.appendChild(createProductLink(componentData.h2, 'https://pcpartpicker.com/product/'+componentData.tag))
          })
        }
      } catch(e) {
        console.error(e)
      }
    })
  }
})
