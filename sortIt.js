const sortIt = () => {
  document.addEventListener('DOMContentLoaded', (event) => {
      
    const lists = document.querySelectorAll('.sortable-list');
      
      let draggingEle;
      let placeholder;
      let isDraggingStarted = false;
      let sourceList;
      let x = 0;
      let y = 0;

      // swap function 
      const swap = function(nodeA, nodeB) {
          const parentA = nodeA.parentNode;
          const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
          nodeB.parentNode.insertBefore(nodeA, nodeB);
          parentA.insertBefore(nodeB, siblingA);
      };

      // position detection with threshold
      const isAbove = function(nodeA, nodeB) {
          const rectA = nodeA.getBoundingClientRect();
          const rectB = nodeB.getBoundingClientRect();
          // Using a 0.75 factor makes the detection more natural
          return (rectA.top + rectA.height * 0.75) < (rectB.top + rectB.height * 0.25);
      };

      const mouseDownHandler = function(e) {
          draggingEle = e.target;
          sourceList = draggingEle.parentNode;
          
          // initial position
          const rect = draggingEle.getBoundingClientRect();
          x = e.pageX - rect.left;
          y = e.pageY - rect.top;

          draggingEle.style.width = `${rect.width}px`;
          
          document.addEventListener('mousemove', mouseMoveHandler);
          document.addEventListener('mouseup', mouseUpHandler);
      };

      const mouseMoveHandler = function(e) {
          const draggingRect = draggingEle.getBoundingClientRect();

          if (!isDraggingStarted) {
              isDraggingStarted = true;
              
              // Create and style placeholder
              placeholder = document.createElement('li');
              placeholder.classList.add('placeholder');
              draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling);
              placeholder.style.height = `${draggingRect.height}px`;
          }

          // Set dragging element position
          draggingEle.style.position = 'absolute';
          draggingEle.style.top = `${e.pageY - y}px`;
          draggingEle.style.left = `${e.pageX - x}px`;
          draggingEle.classList.add('dragging');

          // Find target list with increased detection area
          const targetList = Array.from(lists).find(list => {
              const rect = list.getBoundingClientRect();
              // bufferzone for easier placement of drag/drop
              return e.pageX >= (rect.left - 10) && 
                     e.pageX <= (rect.right + 10) &&
                     e.pageY >= (rect.top - 10) && 
                     e.pageY <= (rect.bottom + 10);
          });

          if (targetList) {
              if (targetList === sourceList) {
                  // list sorting
                  const prevEle = draggingEle.previousElementSibling;
                  const nextEle = placeholder.nextElementSibling;
                  
                  if (prevEle && isAbove(draggingEle, prevEle)) {
                      swap(placeholder, draggingEle);
                      swap(placeholder, prevEle);
                      return;
                  }
                  
                  if (nextEle && isAbove(nextEle, draggingEle)) {
                      swap(nextEle, placeholder);
                      swap(nextEle, draggingEle);
                  }
              } else {
                  // Between lists sorting 
                  const targetItems = targetList.querySelectorAll('li:not(.dragging):not(.placeholder)');
                  
                  // Move placeholder to new list if needed
                  if (placeholder.parentNode !== targetList) {
                      targetList.appendChild(placeholder);
                  }

                  // Enhanced position finding logic
                  let closestItem = null;
                  let closestDistance = Number.POSITIVE_INFINITY;

                  targetItems.forEach(item => {
                      const itemRect = item.getBoundingClientRect();
                      const itemCenter = itemRect.top + itemRect.height / 2;
                      const distance = Math.abs(e.pageY - itemCenter);
                      
                      if (distance < closestDistance) {
                          closestDistance = distance;
                          closestItem = item;
                      }
                  });

                  if (closestItem) {
                      const closestRect = closestItem.getBoundingClientRect();
                      if (e.pageY < closestRect.top + closestRect.height / 2) {
                          targetList.insertBefore(placeholder, closestItem);
                      } else {
                          targetList.insertBefore(placeholder, closestItem.nextSibling);
                      }
                  } else if (targetItems.length === 0) {
                      targetList.appendChild(placeholder);
                  }
              }
          }
      };

      const mouseUpHandler = function() {
          // Place dragging element to final position
          if (placeholder && placeholder.parentNode) {
              placeholder.parentNode.insertBefore(draggingEle, placeholder);
              placeholder.parentNode.removeChild(placeholder);
          }

          // Reset styles 
          draggingEle.style.removeProperty('top');
          draggingEle.style.removeProperty('left');
          draggingEle.style.removeProperty('position');
          draggingEle.style.removeProperty('width');
          draggingEle.classList.remove('dragging');

          

          // Reset vars
          x = null;
          y = null;
          draggingEle = null;
          isDraggingStarted = false;
          sourceList = null;

          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);
      };

     
      lists.forEach(list => {
          Array.from(list.querySelectorAll('li')).forEach(item => {
              item.addEventListener('mousedown', mouseDownHandler);
          });
      });
  });
};

export { sortIt }
/*
const sortIt= () => {
document.addEventListener('DOMContentLoaded', (event) => {
  // Get both lists
  const lists = document.querySelectorAll('.sortable-list');
  let draggingEle;
  let placeholder;
  let isDraggingStarted = false;
  let sourceList;
  let x = 0;
  let y = 0;

  // Swap function for within-list sorting
  const swap = function(nodeA, nodeB) {
      const parentA = nodeA.parentNode;
      const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
      nodeB.parentNode.insertBefore(nodeA, nodeB);
      parentA.insertBefore(nodeB, siblingA);
  };

  const isAbove = function(nodeA, nodeB) {
      const rectA = nodeA.getBoundingClientRect();
      const rectB = nodeB.getBoundingClientRect();
      return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
  };

//calculate wheere the mouse is and where the element is when clicked
  const mouseDownHandler = function(e) {
      draggingEle = e.target;
      sourceList = draggingEle.parentNode;
      const rect = draggingEle.getBoundingClientRect();
      x = e.pageX - rect.left;
      y = e.pageY - rect.top;

      // Prevent element resizing
      draggingEle.style.width = `${rect.width}px`;

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
  };

  const mouseMoveHandler = function(e) {
      const draggingRect = draggingEle.getBoundingClientRect();

      if (!isDraggingStarted) {
          isDraggingStarted = true;
          placeholder = document.createElement('li');
          placeholder.classList.add('placeholder');
          draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling);
          placeholder.style.height = `${draggingRect.height}px`;
      }

      draggingEle.style.position = 'absolute';
      draggingEle.style.top = `${e.pageY - y}px`;
      draggingEle.style.left = `${e.pageX - x}px`;
      draggingEle.classList.add('dragging');

      // Find the list the dragging element is currently  above
      const targetList = Array.from(lists).find(list => {
          const rect = list.getBoundingClientRect();
          return e.pageX >= rect.left && e.pageX <= rect.right &&
                 e.pageY >= rect.top && e.pageY <= rect.bottom;
      });

      if (targetList) {
          // If dragging with in the same list
          if (targetList === sourceList) {
              const prevEle = draggingEle.previousElementSibling;
              const nextEle = placeholder.nextElementSibling;
              
              if (prevEle && isAbove(draggingEle, prevEle)) {
                  swap(placeholder, draggingEle);
                  swap(placeholder, prevEle);
                  return;
              }
              
              if (nextEle && isAbove(nextEle, draggingEle)) {
                  swap(nextEle, placeholder);
                  swap(nextEle, draggingEle);
              }
          } else {
              // If dragging between lists
              const targetRect = targetList.getBoundingClientRect();
              const targetItems = targetList.querySelectorAll('li:not(.dragging):not(.placeholder)');
              
              // Move placeholder to the new list if it's not already there
              if (placeholder.parentNode !== targetList) {
                  targetList.appendChild(placeholder);
              }

              // Find the correct position in the target list
              let closestItem = null;
              let closestOffset = Number.NEGATIVE_INFINITY;

              targetItems.forEach(item => {
                  const itemRect = item.getBoundingClientRect();
                  const offset = e.pageY - (itemRect.top + itemRect.height / 2);
                  
                  if (offset < 0 && offset > closestOffset) {
                      closestOffset = offset;
                      closestItem = item;
                  }
              });

              if (closestItem) {
                  targetList.insertBefore(placeholder, closestItem);
              }
          }
      }
  };

  const mouseUpHandler = function() {
      if (placeholder && placeholder.parentNode) {
          // Move the dragging element to its new position
          placeholder.parentNode.insertBefore(draggingEle, placeholder);
          placeholder.parentNode.removeChild(placeholder);
      }

      // Reset styles
      draggingEle.style.removeProperty('top');
      draggingEle.style.removeProperty('left');
      draggingEle.style.removeProperty('position');
      draggingEle.style.removeProperty('width');
      draggingEle.classList.remove('dragging');

      // Reset variables
      x = null;
      y = null;
      draggingEle = null;
      isDraggingStarted = false;
      sourceList = null;

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
  };

 
  lists.forEach(list => {
      Array.from(list.querySelectorAll('li')).forEach(item => {
          item.addEventListener('mousedown', mouseDownHandler);
      });
  });
});

}

export {sortIt}
*/