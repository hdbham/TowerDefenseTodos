import Phaser from 'phaser';

// Task class
class Task {
  constructor(name, deadline, category) {
    this.name = name;
    this.deadline = new Date(deadline).getTime(); // Store deadline as milliseconds
    this.category = category;
  }
}

// Baddy class
class Baddy extends Phaser.GameObjects.Sprite {
  constructor(scene, task, x, y) {
    super(scene, x, y, 'baddy');
    scene.add.existing(this);

    this.task = task;
    this.startTime = Date.now();
    this.duration = task.deadline - this.startTime;
    this.distanceX = scene.tower.x - x; // Calculate the distance from the initial x position to the tower
    this.speedPerFrame = (this.distanceX / this.duration) * (1000 / 60);

    this.currentFrame = 0;
    this.frameWidth = 64;
    this.frameHeight = 64;
    this.frameCount = 8;
    this.frameTimer = 0;
    this.frameInterval = 100; // milliseconds

    this.play('baddyAnimation');
  }

  update() {
    const currentTime = Date.now();
    const remainingTime = this.task.deadline - currentTime;
  
    if (remainingTime > 0) {
      const remainingDistance = (this.speedPerFrame * remainingTime) / (1000 / 60);
      const newPosition = this.scene.tower.x - remainingDistance;
      this.x = newPosition;
    } else {
      console.log("Baddy has reached the tower");
      // Handle tower update based on task
      const taskIndex = this.scene.tasks.findIndex((task) => task === this.task);
      if (taskIndex !== -1) {
        this.scene.tasks.splice(taskIndex, 1); // Remove the task from the array
        this.scene.updateTaskList(); // Update the task list
      }
      // Remove the baddy from the array and destroy it
      const baddyIndex = this.scene.baddies.findIndex((b) => b === this);
      if (baddyIndex !== -1) {
        this.scene.baddies.splice(baddyIndex, 1);
        this.destroy();
      }
    }
  }
  
}

// Tower class
class Tower extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, width, height) {
    super(scene, x, y, 'tower');
    this.displayWidth = width;
    this.displayHeight = height;
    scene.add.existing(this);
  }
}

class MyScene extends Phaser.Scene {
  constructor() {
    super('MyScene');
    this.tasks = []; // Array to store tasks
    this.baddies = []; // Array to store baddies
  }

  preload() {
    this.load.image('tower', 'src/assets/tower.png');
    this.load.spritesheet('baddy', 'src/assets/baddy.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.cameras.main.setBackgroundColor('#E1F5FE'); // Light blue background color

    this.tower = new Tower(this, this.game.config.width - 110, this.game.config.height - 80, 110, 160);


    
    // Create the task form event listeners and handle submission
    const taskForm = document.getElementById("task-form");
    taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const taskInput = document.getElementById("task-input");
      const deadlineInput = document.getElementById("deadline-input");
      const categorySelect = document.getElementById("category-select");
      const category = categorySelect.value;
      const newTask = new Task(taskInput.value, deadlineInput.value, category);
      this.tasks.push(newTask); // Add the new task to the tasks array

      // Create a new baddy based on the task and add it to the baddies array
      const baddy = new Baddy(this, newTask, 0, this.tower.y);
      this.baddies.push(baddy);
      this.updateTaskList(); // Update the task list
      taskInput.value = ""; // Clear the task input
    });



    // Animation configuration
    this.anims.create({
      key: 'baddyAnimation',
      frames: this.anims.generateFrameNumbers('baddy'),
      frameRate: 10,
      repeat: -1,
    });

    this.taskList = document.getElementById('task-list'); // Get the task list element
  }
  updateTaskList() {
    this.taskList.innerHTML = ''; // Clear the task list
  
    this.tasks.forEach((task) => {
      const li = document.createElement('li');
      const taskName = document.createElement('span');
      taskName.textContent = task.name;
      li.appendChild(taskName);
  
      const taskDescription = document.createElement('span');
      taskDescription.textContent = task.description;
      li.appendChild(taskDescription);
  
      const taskTimer = document.createElement('span');
      const currentTime = Date.now();
      const remainingTime = task.deadline - currentTime;
  
      if (remainingTime > 0) {
        const secondsRemaining = Math.ceil(remainingTime / 1000);
        taskTimer.textContent = `Time remaining: ${secondsRemaining}s`;
        setInterval(() => {
          const updatedTime = Date.now();
          const updatedRemainingTime = task.deadline - updatedTime;
          if (updatedRemainingTime > 0) {
            const updatedSecondsRemaining = Math.ceil(updatedRemainingTime / 1000);
            taskTimer.textContent = `Time remaining: ${updatedSecondsRemaining}s`;
          } else {
            taskTimer.textContent = 'Time is up!';
          }
        }, 1000);
      } else {
        taskTimer.textContent = 'Time is up!';
      }
  
      li.appendChild(taskTimer);
      this.taskList.appendChild(li);
    });
  }
  

  update() {
    this.baddies.forEach((baddy) => {
      baddy.update();
    });
  }
}

const config = {
  type: Phaser.AUTO,
//   width: 300,
//   height: 300,
  scene: MyScene,
};

const game = new Phaser.Game(config);
