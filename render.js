function filterTopics(option) {
  switch(option) {
    case "all":
      for (el of document.getElementsByTagName('li'))
        el.removeAttribute('hidden', false);
      break;
    case "published":
      for (el of document.getElementsByTagName('li')) {
        let toHide = true;
        for (child of el.children) {
          if ((child.tagName === "UL" && !fullUnpublished(child)) || child.tagName === "A") {
            toHide = false;
            break;
          }
        }
        toHide ? el.setAttribute('hidden', true) : el.removeAttribute('hidden');
      }
      break;
    case "not-published":
      for (el of document.getElementsByTagName('li')) {
        let toHide = false;
        for (child of el.children) {
          if (child.tagName === "A") {
            toHide = true;
            break;
          }
          if (child.tagName === "UL" && fullPublished(child)) {
            toHide = true;
            break;
          }
        }
        toHide ? el.setAttribute('hidden', true) : el.removeAttribute('hidden');
      }
      break;
  }
};

function fullPublished(el) {
  let isAllPublished = true;
  let hasPublished = false;

  for (li of el.children) {
    if (li.children.length === 0)
      isAllPublished = false;
    for (inner of li.children) {
      if (inner.tagName === "A")
        hasPublished = true;
      if (inner.tagName !== "A")
        isAllPublished = false;
    }
  }
  return hasPublished && isAllPublished;
};

function fullUnpublished(el) {
  let hasInnerLinks = false;
  for (child of el.children)
    for (inner of child.children) {
      if (inner.tagName === 'A')
        return false;
      if (inner.tagName === 'UL')
        hasInnerLinks |= !fullUnpublished(inner);
    }
  return !hasInnerLinks;
};

function search() {
  let value = document.getElementById('search-field').value.toLowerCase();
  reRender();

  if (value !== '') {
    for (el of document.getElementsByTagName('li')) {
      if (isTopic(el)) {
        if (!el.textContent.toLowerCase().includes(value))
          el.setAttribute('hidden', true);
        else
          el.removeAttribute('hidden');
      }
    }
    for (el of document.getElementsByTagName('li')) {
      if (!isTopic(el)) {
        if (containsVisibleTopic(el))
          el.removeAttribute('hidden');
        else
          el.setAttribute('hidden', true);
      }
    }
  }
};

function isTopic(el) {
  for (inner of el.children)
    if (inner.tagName === 'UL')
      return false;
  return true;
};

function containsVisibleTopic(el) {
  let hasVisibleTopic = false;
  if (el.tagName === 'LI') {
    if (isTopic(el) && !el.hidden) return true;
    for (inner of el.children)
      if (inner.tagName === 'UL' )
        hasVisibleTopic |= containsVisibleTopic(inner);
  } else {
    for (inner of el.children)
      hasVisibleTopic |= containsVisibleTopic(inner);
  }

  return hasVisibleTopic;
};

function reRender() {
  for (id of ['all', 'published', 'not-published'])
    if (document.getElementById(id).checked)
      filterTopics(id);
};

window.onload = function updateTotalNumber() {
  let totalPublished = 0;
  let totalNotPublished = 0;

  for (el of document.getElementsByTagName('li')) {
    let isPublished = false;
    let isRoot = false;
    for (child of el.children) {
      if (child.tagName === "A")
        isPublished = true;
      if (child.tagName === "UL")
        isRoot = true;
    }
    if (!isRoot) isPublished ? ++totalPublished : ++totalNotPublished;
  }

  document.getElementById('select-all').textContent = `All (${totalPublished + totalNotPublished})`;
  document.getElementById('select-published').textContent = `Published (${totalPublished})`;
  document.getElementById('select-not-published').textContent = `Not Published (${totalNotPublished})`;
};
