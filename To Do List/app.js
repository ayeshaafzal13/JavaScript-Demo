document.addEventListener('DOMContentLoaded', () => {
    const storedtasks = JSON.parse(localStorage.getItem('tasks'));

    if (storedtasks) {
        storedtasks.forEach(task => tasks.push(task));
        updatetasklist();
        updatestats();
    }
});

let tasks = [];
let editIndex = -1; // <-- track which task is being edited

const savetasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add / Save combined
const addtask = () => {
    const taskinput = document.getElementById('taskinput');
    const text = taskinput.value.trim();
    const newTaskBtn = document.getElementById('newtask');
    const cancelBtn = ensureCancelButton(); // ensure cancel button exists

    if (!text) return;

    if (editIndex >= 0) {
        // Save edited task in-place
        tasks[editIndex].text = text;
        editIndex = -1;
        newTaskBtn.innerText = '+';
        cancelBtn.style.display = 'none';
    } else {
        // Normal add
        tasks.push({ text: text, completed: false });
    }

    taskinput.value = '';
    updatetasklist();
    updatestats();
    savetasks();
};

const toggletaskcompletion = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updatetasklist();
    updatestats();
    savetasks();
};

const deletetask = (index) => {
    // if deleting the task currently being edited, cancel edit
    if (editIndex === index) {
        cancelEdit();
    } else if (editIndex > index) {
        // if removing an earlier task, shift editIndex left by 1
        editIndex--;
    }

    tasks.splice(index, 1);
    updatetasklist();
    updatestats();
    savetasks();
};

const edittask = (index) => {
    const taskinput = document.getElementById('taskinput');
    const newTaskBtn = document.getElementById('newtask');
    const cancelBtn = ensureCancelButton();

    // Set input to current text, set editIndex instead of removing task
    taskinput.value = tasks[index].text;
    taskinput.focus();
    editIndex = index;

    // UI: change button to save and show cancel
    newTaskBtn.innerText = '✔️';
    cancelBtn.style.display = 'inline-block';
};

const updatestats = () => {
    const completedtasks = tasks.filter(task => task.completed).length;
    const totaltasks = tasks.length;
    const progress = totaltasks > 0 ? (completedtasks / totaltasks) * 100 : 0;
    const progressbar = document.getElementById('progress');
    if (progressbar) progressbar.style.width = `${progress}%`;

    const numbersEl = document.getElementById('numbers');
    if (numbersEl) numbersEl.innerText = `${completedtasks} / ${totaltasks}`;

    if (tasks.length > 0 && completedtasks === totaltasks) {
        blastconfetti();
    }
};

const updatetasklist = () => {
    const tasklist = document.getElementById('task-list');
    tasklist.innerHTML = '';

    tasks.forEach((task, index) => {
        const listitem = document.createElement('li');

        listitem.innerHTML = `
        <div class="taskitem">
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} onchange="toggletaskcompletion(${index})"/>
                <p>${escapeHtml(task.text)}</p>
            </div>
            <div class="icons">
                <i class="fa-solid fa-pen-to-square" onclick="edittask(${index})" title="Edit task"></i>
                <i class="fa-solid fa-trash" onclick="deletetask(${index})" title="Delete task"></i>
            </div>
        </div>
        `;

        tasklist.append(listitem);
    });
};

// helper to create/show cancel button if not present
function ensureCancelButton() {
    let cancelBtn = document.getElementById('cancelEdit');
    const newTaskBtn = document.getElementById('newtask');
    if (!cancelBtn) {
        cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancelEdit';
        cancelBtn.type = 'button';
        cancelBtn.innerText = 'x';
        cancelBtn.style.marginLeft = '8px';
        cancelBtn.style.display = 'none';
        cancelBtn.addEventListener('click', cancelEdit);

        // place after the main button if possible
        if (newTaskBtn && newTaskBtn.parentNode) {
            newTaskBtn.parentNode.insertBefore(cancelBtn, newTaskBtn.nextSibling);
        } else {
            document.body.appendChild(cancelBtn);
        }
    }
    return cancelBtn;
}

function cancelEdit() {
    const taskinput = document.getElementById('taskinput');
    const newTaskBtn = document.getElementById('newtask');
    const cancelBtn = document.getElementById('cancelEdit');

    editIndex = -1;
    taskinput.value = '';
    if (newTaskBtn) newTaskBtn.innerText = '+';
    if (cancelBtn) cancelBtn.style.display = 'none';
}

// small helper to avoid HTML injection when injecting task text
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.getElementById('newtask').addEventListener('click', function (e) {
    e.preventDefault();
    addtask();
});

// make Enter key add/save
document.getElementById('taskinput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addtask();
    } else if (e.key === 'Escape') {
        // allow escape to cancel the edit
        cancelEdit();
    }
});

const blastconfetti = () => {
    const count = 200,
        defaults = {
            origin: { y: 0.7 },
        };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
};
