// DOM elements
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const addTodoBtn = document.getElementById('add-todo');
const clearCompletedBtn = document.getElementById('clear-completed');

// Constants
const TODOS_COLLECTION = 'todos';

/**
 * Load todos from Firestore and render them
 */
async function loadTodos() {
    try {
        // Clear existing todos from the DOM
        todoList.innerHTML = '';
        
        // Get todos from Firestore, ordered by position
        const snapshot = await db.collection(TODOS_COLLECTION).orderBy('position', 'desc').get();
        
        // Add each todo to the DOM
        snapshot.forEach((doc) => {
            const todoData = doc.data();
            addTodoToDOM(doc.id, todoData.text, todoData.completed);
        });
        
        updateArrowVisibility();
    } catch (error) {
        console.error("Error loading todos: ", error);
    }
}

/**
 * Create and add a todo item to the DOM
 * @param {string} id - Firestore document ID
 * @param {string} todoText - The text content of the todo
 * @param {boolean} completed - Whether the todo is completed
 */
function addTodoToDOM(id, todoText, completed = false) {
    const li = document.createElement('li');
    li.dataset.id = id; // Store the Firestore document ID
    if (completed) li.classList.add('completed');

    // Create text span
    const textSpan = document.createElement('span');
    textSpan.textContent = todoText;
    if (completed) textSpan.style.textDecoration = 'line-through';

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    // Add up and down buttons
    buttonContainer.appendChild(createArrowButton('&#8593;', 'Move up', async (event) => {
        event.stopPropagation();
        const prev = li.previousElementSibling;
        if (prev) {
            li.parentNode.insertBefore(li, prev);
            await updatePositions();
            updateArrowVisibility();
        }
    }));

    buttonContainer.appendChild(createArrowButton('&#8595;', 'Move down', async (event) => {
        event.stopPropagation();
        const next = li.nextElementSibling;
        if (next) {
            li.parentNode.insertBefore(next, li);
            await updatePositions();
            updateArrowVisibility();
        }
    }));

    // Append elements to list item
    li.appendChild(textSpan);
    li.appendChild(buttonContainer);

    // Add click event to toggle completion
    li.addEventListener('click', async () => {
        li.classList.toggle('completed');
        textSpan.style.textDecoration = textSpan.style.textDecoration === 'line-through' ? '' : 'line-through';
        
        // Update in Firestore
        const docRef = db.collection(TODOS_COLLECTION).doc(li.dataset.id);
        await docRef.update({
            completed: li.classList.contains('completed')
        });
    });

    // Add to list (at the top)
    todoList.insertBefore(li, todoList.firstChild);
    
    // Update arrow visibility after adding a new item
    updateArrowVisibility();
}

/**
 * Create an arrow button with specified properties
 * @param {string} html - HTML content for the button
 * @param {string} title - Title attribute for the button
 * @param {Function} clickHandler - Event handler for click
 * @returns {HTMLButtonElement} - The created button
 */
function createArrowButton(html, title, clickHandler) {
    const button = document.createElement('button');
    button.innerHTML = html;
    button.className = 'arrow-button';
    button.title = title;
    button.addEventListener('click', clickHandler);
    return button;
}

/**
 * Update positions of all todos in Firestore based on their current DOM order
 */
async function updatePositions() {
    try {
        const items = Array.from(todoList.children);
        const totalItems = items.length;
        
        // Update each item with its new position
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const docRef = db.collection(TODOS_COLLECTION).doc(item.dataset.id);
            await docRef.update({
                position: totalItems - i // Reverse order so newest appears first
            });
        }
    } catch (error) {
        console.error("Error updating positions: ", error);
    }
}

/**
 * Update visibility of arrow buttons based on todo count
 */
function updateArrowVisibility() {
    const todoItems = todoList.children;
    const isSingleItem = todoItems.length === 1;
    
    Array.from(todoItems).forEach((item, index) => {
        const buttons = item.querySelectorAll('.arrow-button');
        const isFirstItem = index === 0;
        const isLastItem = index === todoItems.length - 1;
        
        // If there's only one item, hide both buttons
        if (isSingleItem) {
            buttons.forEach(btn => btn.style.display = 'none');
        } else {
            // Up button: hide for first item, show for others
            buttons[0].style.display = isFirstItem ? 'none' : 'block';
            
            // Down button: hide for last item, show for others
            buttons[1].style.display = isLastItem ? 'none' : 'block';
        }
    });
}

/**
 * Add a new todo to Firestore and DOM
 */
async function addNewTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === '') return;

    try {
        // Get the current highest position
        const todoItems = document.querySelectorAll('#todo-list li');
        const position = todoItems.length > 0 ? todoItems.length : 0;
        
        // Add to Firestore
        const docRef = await db.collection(TODOS_COLLECTION).add({
            text: todoText,
            completed: false,
            position: position,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Add to DOM
        addTodoToDOM(docRef.id, todoText);
        
        // Clear input
        todoInput.value = '';
        
        // Update arrow visibility
        updateArrowVisibility();
    } catch (error) {
        console.error("Error adding todo: ", error);
    }
}

/**
 * Clear completed todos from Firestore and DOM
 */
async function clearCompleted() {
    try {
        const completedItems = document.querySelectorAll('#todo-list li.completed');
        
        // Create a batch to perform multiple deletes
        const batch = db.batch();
        
        completedItems.forEach((item) => {
            const docId = item.dataset.id;
            const docRef = db.collection(TODOS_COLLECTION).doc(docId);
            batch.delete(docRef);
            
            // Remove from DOM
            item.remove();
        });
        
        // Commit the batch
        await batch.commit();
        
        // Update positions and arrow visibility
        await updatePositions();
        updateArrowVisibility();
    } catch (error) {
        console.error("Error clearing completed todos: ", error);
    }
}

// Event Listeners
addTodoBtn.addEventListener('click', addNewTodo);

todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addNewTodo();
    }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// Initialize app
document.addEventListener('DOMContentLoaded', loadTodos);
