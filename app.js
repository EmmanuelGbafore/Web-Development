// Initialize Firebase with your config
firebase.initializeApp({
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
});

const db = firebase.firestore();

// Function to add a task
function addTask() {
    const taskInput = document.getElementById("task-input");
    const task = taskInput.value.trim();
    if (task !== "") {
        db.collection("tasks").add({
            task: task,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        taskInput.value = "";
    }
}

// Function to render tasks
function renderTasks(doc, index) {
    const taskList = document.getElementById("task-list");
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    taskItem.id = doc.id; // Set the task id as element id for easy deletion
    taskItem.innerHTML = `
        <span>${index + 1}. ${doc.data().task}</span>
        <button onclick="deleteTask('${doc.id}')"></button>
    `;
    taskList.appendChild(taskItem);
}

// Real-time listener for tasks
db.collection("tasks")
    .orderBy("timestamp", "desc")
    .onSnapshot(snapshot => {
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = ""; // Clear the list before rendering new snapshot
        let index = 0;
        snapshot.forEach(doc => {
            renderTasks(doc, index);
            index++;
        });
    });

// Function to delete a task
function deleteTask(id) {
    db.collection("tasks").doc(id).delete().then(() => {
        document.getElementById(id).remove(); // Remove the task from the DOM
    });
}
