class Task {
    constructor(name, deadline, category) {
      this.name = name;
      this.deadline = new Date(deadline).getTime(); // Store deadline as milliseconds
      this.category = category;
    }
  }

  class Baddy {
    constructor(task) {
      this.task = task;
      this.x = 1;
      this.y = canvas.height - 5;
      this.width = 5;
      this.height = 5;
      this.startTime = Date.now();
      this.duration = task.deadline - this.startTime;
      this.distanceX = tower.getX() - this.x;
      this.speedPerFrame = (this.distanceX / this.duration) * (1000 / 60);
      this.color = getCategoryColor(this.task.category); // Get the category color

      this.setPosition = this.setPosition.bind(this);
      this.move = this.move.bind(this);
      this.draw = this.draw.bind(this);
    }

    setPosition(x, y) {
      this.x = x;
      this.y = y;
    }

    move() {
      const currentTime = Date.now();
      const remainingTime = this.task.deadline - currentTime;
      const remainingDistance =
        (this.distanceX / this.duration) * remainingTime;
      const newPosition = tower.getX() - remainingDistance;
      this.setPosition(newPosition, this.y);
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Tower {
    constructor() {
      this.x = canvas.width - 40;
      this.y = canvas.height - 40;
      this.width = 20;
      this.height = 60;
    }

    getX() {
      return this.x;
    }
  }

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const tower = new Tower();

  const tasks = [];
  const baddies = [];

  const taskList = document.getElementById("task-list");
  const taskForm = document.getElementById("task-form");

  taskForm.addEventListener("submit", handleTaskSubmit);
  canvas.addEventListener("click", handleCanvasClick);

  function getCategoryColor(category) {
    const CategoryColors = {
      A: "#FF0000", // Red
      B: "#00FF00", // Green
      C: "#0000FF", // Blue
      D: "#FFFF00", // Yellow
      E: "#FF00FF", // Magenta
      F: "#00FFFF", // Cyan
      G: "#FFA500", // Orange
      H: "#800080", // Purple
      I: "#008000", // Dark Green
      J: "#FFC0CB", // Pink
      K: "#FFD700", // Gold
      L: "#A52A2A", // Brown
      M: "#800000", // Maroon
      N: "#008080", // Teal
      O: "#808000", // Olive
      P: "#FF1493", // Deep Pink
      Q: "#000080", // Navy
      R: "#FA8072", // Salmon
      S: "#FF4500", // Orange Red
      T: "#800000", // Dark Red
      U: "#9400D3", // Dark Violet
      V: "#4B0082", // Indigo
      W: "#808080", // Gray
      X: "#C0C0C0", // Silver
      Y: "#FF8C00", // Dark Orange
      Z: "#FF69B4" // Hot Pink
    };

    const color = CategoryColors[category.toUpperCase()[0]];
    return color;
  }

  function handleTaskSubmit(e) {
    e.preventDefault();
    const taskInput = document.getElementById("task-input");
    const deadlineInput = document.getElementById("deadline-input");
    const categorySelect = document.getElementById("category-select");

    const category = categorySelect.value;

    const newTask = new Task(
      taskInput.value,
      deadlineInput.value,
      category
    ); // Pass the category
    tasks.push(newTask);
    const newBaddy = new Baddy(newTask); // Pass the task
    baddies.push(newBaddy);

    renderGame();
  }

  function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.textContent = "Delete";
      btn.addEventListener("click", () => removeTask(index));

      const timeDifference = task.deadline - Date.now();
      const timeRemaining = Math.max(0, Math.ceil(timeDifference / 1000));

      li.textContent = `Task: ${task.name} - Deadline: ${new Date(
        task.deadline
      ).toLocaleString()} - Time Remaining: ${timeRemaining} seconds   `;
      li.appendChild(btn);

      const categoryColor = getCategoryColor(task.category);
      if (categoryColor) {
        li.style.color = categoryColor;
      }

      taskList.appendChild(li);
    });
  }

  function removeTask(index) {
    tasks.splice(index, 1);
    baddies.splice(index, 1); // Remove the associated baddy
    renderGame();
  }

  function drawBaddies() {
    baddies.forEach((baddy) => {
      baddy.draw();
    });
  }

  function moveBaddies() {
    baddies.forEach((baddy) => {
      baddy.move();
    });
  }

  function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render tower
    ctx.fillStyle = "black";
    ctx.fillRect(tower.x, tower.y, tower.width, tower.height);

    moveBaddies(); // Move the baddies
    drawBaddies(); // Draw the baddies

    renderTasks();

    const remainingTime = tasks.reduce(
      (minTime, task) => Math.min(minTime, task.deadline - Date.now()),
      Infinity
    );

    if (remainingTime <= 0.001) {
      const index = baddies.findIndex(
        (baddy) => baddy.task.deadline <= Date.now()
      );
      if (index !== -1) {
        baddies.splice(parseInt(tasks[index]?.name), 1);
      }
      console.log(
        `Index: ${index}, Task: ${tasks[index]?.name}, Category: ${tasks[index]?.category}`
      );

      baddies.splice(index, 1);

      return; // Stop further rendering
    }

    requestAnimationFrame(renderGame);
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderGame();
  });