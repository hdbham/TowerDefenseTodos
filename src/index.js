import Phaser from 'phaser';
import { Task, Baddy, Tower } from './classes';


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
